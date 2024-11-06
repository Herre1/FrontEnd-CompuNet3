

# Informe de Funcionalidades - Proyecto Computación en Internet III

## 1. Descripción General

La aplicación proporciona un sistema de gestión de contenidos, que incluye funcionalidades para manejar usuarios, contenidos, comentarios, reacciones y listas de contenidos. La aplicación está construida sobre **NestJS** para el backend y **Next.js** para el frontend, utilizando **PostgreSQL** como sistema de gestión de base de datos. A continuación, se describen las funcionalidades principales implementadas.

## 2. Funcionalidades Implementadas

### 2.1. **Gestión de Usuarios**

La API permite realizar operaciones CRUD sobre usuarios:

- **GET /users**: Obtiene una lista de todos los usuarios registrados.
- **GET /users/:id**: Obtiene los detalles de un usuario específico por su `id` (UUID).
- **PUT /users/:id**: Actualiza la información de un usuario existente.
- **DELETE /users/:id**: Elimina un usuario por su `id`.

#### Autenticación y Autorización:
El sistema de autenticación se basa en **JWT (JSON Web Tokens)**. Los usuarios deben estar autenticados para acceder a rutas protegidas. La autenticación se realiza con un token JWT que se obtiene al iniciar sesión.

### 2.2. **Gestión de Contenido (Películas, Series, Animes)**

Los administradores pueden gestionar el contenido mediante los siguientes endpoints:

- **POST /api/v1/content**: Permite crear un nuevo contenido (solo admins).
- **GET /api/v1/content**: Lista todos los contenidos disponibles.
- **GET /api/v1/content/:id**: Obtiene detalles de un contenido específico por su `id` (UUID).
- **PATCH /api/v1/content/:id**: Actualiza un contenido existente.
- **DELETE /api/v1/content/:id**: Elimina un contenido (solo admins).

### 2.3. **Gestión de Comentarios**

Los usuarios pueden interactuar con el contenido mediante comentarios:

- **POST /api/v1/comments**: Crea un nuevo comentario para un contenido específico.
- **GET /api/v1/comments**: Obtiene todos los comentarios.
- **GET /api/v1/comments/:id**: Obtiene un comentario específico por `id`.
- **POST /api/v1/comments/reply/:id**: Responde a un comentario específico.
- **GET /api/v1/comments/parent/:id**: Obtiene todas las respuestas a un comentario específico.
- **PATCH /api/v1/comments/:id**: Actualiza un comentario.
- **DELETE /api/v1/comments/:id**: Elimina un comentario.

### 2.4. **Reacciones a Comentarios**

Los usuarios pueden reaccionar a los comentarios con "like" o "dislike":

- **POST /api/v1/reactions**: Crea una nueva reacción en un comentario.
- **GET /api/v1/reactions**: Obtiene todas las reacciones.
- **GET /api/v1/reactions/comment/:id**: Obtiene las reacciones de un comentario específico.
- **GET /api/v1/reactions/user/:userId**: Obtiene las reacciones de un usuario.
- **DELETE /api/v1/reactions/:id**: Elimina una reacción específica.

### 2.5. **Gestión de Listas de Contenidos**

Las listas de contenidos permiten a los usuarios agrupar sus contenidos favoritos:

- **POST /api/v1/lists**: Crea una nueva lista de contenido para un usuario.
- **GET /api/v1/lists/:userId**: Obtiene todas las listas asociadas a un usuario.
- **DELETE /api/v1/lists/:id**: Elimina una lista específica.

## 3. Autenticación y Autorización

La autenticación y autorización en la aplicación se gestionan mediante **JWT (JSON Web Tokens)**. A continuación se describe cómo se implementan estas características:

### 3.1. **Autenticación con JWT**

La autenticación se lleva a cabo en el endpoint **POST /auth/login**, donde los usuarios envían sus credenciales (correo electrónico y contraseña). Si las credenciales son válidas, el servidor genera un token JWT que incluye información del usuario (como su `id`) y lo devuelve al cliente. Este token se utiliza en las siguientes solicitudes para autenticar al usuario.

### 3.2. **Autorización con Guards**

Se utilizan **guards** en NestJS para proteger las rutas que requieren autenticación y roles específicos. Los guards verifican la validez del token JWT antes de permitir el acceso a las rutas protegidas. Dos tipos de guards se utilizan en esta aplicación:

- **AuthGuard**: Verifica si el usuario está autenticado y si el JWT es válido.
- **UserRoleGuard**: Verifica si el usuario tiene el rol necesario para acceder a una ruta específica.

#### Decoradores:
- **@Auth()**: Se utiliza para proteger las rutas y especificar los roles que tienen acceso a ellas.
- **@GetUser()**: Permite obtener los datos del usuario autenticado a partir del JWT.

### 3.3. **Gestión del Estado en el Frontend**

En el frontend, se utiliza el contexto de React (a través del hook `useAuth`) para gestionar el estado de autenticación. El estado de autenticación incluye el token JWT y el ID del usuario, que se almacenan en el **localStorage** del navegador.

Cuando el usuario inicia sesión, el token se guarda en el `localStorage`, y las peticiones HTTP a los endpoints protegidos incluyen este token en las cabeceras como un **Bearer Token**. Si el token no está presente, el usuario es redirigido a la página de login.

### Ejemplo de manejo del estado en el frontend:

```tsx
const { token, userId } = useAuth();

useEffect(() => {
  const fetchUserLists = async () => {
    if (!token) {
      router.push('/login');
      return;
    }

    const userId = localStorage.getItem('userId');
    if (!userId) {
      setError('User ID not found');
      return;
    }

    try {
      const response = await axios.get(`https://example.com/api/v1/lists/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLists(response.data);
    } catch (error) {
      setError('Failed to load lists');
    }
  };

  fetchUserLists();
}, [token, router]);
```

En este ejemplo, se verifica si el token está disponible en el `localStorage`. Si está presente, se realiza una solicitud GET a la API para obtener las listas del usuario. Si no está presente, el usuario es redirigido a la página de login.

## 4. Persistencia de Datos

La persistencia de datos se maneja utilizando **PostgreSQL** como base de datos relacional y **TypeORM** como ORM. Cada entidad de la aplicación está mapeada a una tabla en la base de datos.

- **Relaciones entre entidades**: Utilizamos relaciones **OneToMany** y **ManyToOne** para manejar las dependencias entre entidades como usuarios y comentarios, o comentarios y reacciones.
- **Sincronización automática**: Se ha utilizado la opción `synchronize: true` para que TypeORM sincronice automáticamente los cambios en las entidades con la base de datos.
- **DTOs y validaciones**: Utilizamos `class-validator` para validar los datos en los DTOs antes de almacenarlos en la base de datos.

## 5. Conclusiones

La implementación de la API permite a los usuarios gestionar su contenido a través de un sistema de autenticación y autorización robusto. Las funciones CRUD de usuarios, contenido, comentarios, reacciones y listas permiten una amplia personalización y gestión de datos. La autenticación basada en JWT asegura que solo los usuarios autenticados puedan acceder a las rutas protegidas, y el uso de guards y decoradores en NestJS facilita la implementación de la autorización basada en roles.

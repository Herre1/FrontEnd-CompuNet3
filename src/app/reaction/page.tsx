'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../store/AuthContext'; // Para obtener el token
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Navbar from '@/components/nav-bar/NavBar'; // Asegúrate de tener la referencia correcta de Navbar

interface User {
  id: string;
  fullName: string;
  email: string;
}

interface Comment {
  id: string;
  content: string;
  reactionsCount: number;
  createdAt: string;
  updatedAt: string;
}

interface Reaction {
  id: string;
  type: string; // Tipo de reacción, por ejemplo, "like"
  createdAt: string;
  updatedAt: string;
  user: User;
  comment: Comment; // Comentario asociado a la reacción
}

const UserReactions: React.FC = () => {
  const [reactions, setReactions] = useState<Reaction[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { token } = useAuth(); // Obtener el token desde el contexto de autenticación

  useEffect(() => {
    const fetchUserReactions = async () => {
      if (!token) {
        router.push("/login"); // Redirigir al login si no hay token
        return;
      }

      const userId = localStorage.getItem("userId"); // Obtener userId del localStorage
      if (!userId) {
        setError("User ID not found"); // Si no se encuentra el userId
        return;
      }

      try {
        // Hacer la solicitud para obtener las reacciones del usuario
        const response = await axios.get(
          `https://proyecto-compunet-lll.onrender.com/api/v1/reactions/`,
          {
            headers: { Authorization: `Bearer ${token}` }, // Incluir el token en las cabeceras
          }
        );

        console.log("Reacciones recibidas:", response.data);
        setReactions(response.data || []); // Establecer las reacciones obtenidas
      } catch (error) {
        setError("Failed to load reactions"); // Manejar errores
      }
    };

    fetchUserReactions();
  }, [token, router]); // Ejecutar cuando cambia el token o el router

  return (
    <div className="min-h-screen flex">
      {/* Sidebar con Navbar */}
      <div className="w-1/5 bg-gray-900">
        <Navbar />
      </div>

      {/* Contenido Principal */}
      <div className="flex-1 p-6 bg-gray-100">
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-4 text-gray-800">Tus Reacciones</h1>

          {error && <div className="text-red-500 mb-4">{error}</div>}

          {reactions.length > 0 ? (
            <div className="space-y-6">
              {reactions.map((reaction) => (
                <div
                  key={reaction.id}
                  className="bg-blue-50 border border-blue-300 p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow"
                >
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {reaction.type === 'like' ? 'Me gusta' : reaction.type}
                  </h3>

                  <div className="text-sm text-gray-500 mb-4">
                    <p>
                      <strong>Comentario:</strong> {reaction.comment.content}
                    </p>
                    <p>
                      <strong>Reacciones: </strong>
                      {reaction.comment.reactionsCount}
                    </p>
                    <p>
                      <strong>Creado por:</strong> {reaction.user.fullName}
                    </p>
                    <p className="text-xs text-gray-400">
                      <strong>Fecha de creación:</strong>{' '}
                      {new Date(reaction.createdAt).toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-400">
                      <strong>Última actualización:</strong>{' '}
                      {new Date(reaction.updatedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No tienes reacciones disponibles.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserReactions;

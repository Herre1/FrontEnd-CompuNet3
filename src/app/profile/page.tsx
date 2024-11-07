"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useRouter } from "next/navigation";
import Navbar from "@/components/nav-bar/NavBar";

interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  isActive: boolean;
  roles: string[];
}

interface UpdateUserForm {
  fullName: string;
  email: string;
}

const UserProfile: React.FC = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors }, reset } = useForm<UpdateUserForm>();
  const router = useRouter();
  
  // Obtener el token directamente del localStorage
  const getToken = () => localStorage.getItem('token');

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = getToken();
      const userId = localStorage.getItem("userId");

      // Verificación más robusta
      if (!token || !userId) {
        console.log("Token o userId faltante:", { token, userId });
        router.push("/login");
        return;
      }

      try {
        const response = await axios.get(
          `https://proyecto-compunet-lll.onrender.com/api/v1/users/${userId}`,
          {
            headers: { 
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
          }
        );

        if (response.data) {
          setUserProfile(response.data);
          reset(response.data);
        }
      } catch (error) {
        console.error("Error al cargar el perfil:", error);
        
        // Solo redirigir al login si es un error de autenticación
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          router.push("/login");
        } else {
          setError("Error al cargar el perfil de usuario");
        }
      }
    };

    fetchUserProfile();
  }, [reset, router]); // Removemos token de las dependencias

  const onSubmit = async (data: UpdateUserForm) => {
    const token = getToken();
    const userId = localStorage.getItem("userId");

    if (!token || !userId) {
      console.log("Token o userId faltante en submit:", { token, userId });
      router.push("/login");
      return;
    }

    try {
      const response = await axios.put(
        `https://proyecto-compunet-lll.onrender.com/api/v1/users/${userId}`,
        data,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        }
      );

      if (response.status === 200) {
        alert("¡Perfil actualizado exitosamente!");
        setUserProfile(response.data);
      }
    } catch (error) {
      console.error("Error al actualizar el perfil:", error);
      
      // Solo redirigir al login si es un error de autenticación
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        router.push("/login");
      } else {
        setError("Error al actualizar el perfil");
      }
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Navbar a la izquierda */}
      <div className="w-1/5 bg-gray-900">
        <Navbar />
      </div>

      {/* Contenido principal */}
      <div className="flex-1 flex justify-center items-center bg-gray-100 p-6">
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">
            Perfil de Usuario
          </h2>

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 rounded-md p-3 text-sm">
              {error}
            </div>
          )}

          {userProfile ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label
                  htmlFor="fullName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Nombre Completo
                </label>
                <input
                  id="fullName"
                  type="text"
                  defaultValue={userProfile.fullName}
                  {...register("fullName", {
                    required: "El nombre completo es requerido",
                    minLength: {
                      value: 3,
                      message: "El nombre debe tener al menos 3 caracteres",
                    },
                  })}
                  className={`mt-1 block w-full rounded-md border ${
                    errors.fullName ? "border-red-500" : "border-gray-300"
                  } shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                />
                {errors.fullName && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.fullName.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Correo Electrónico
                </label>
                <input
                  id="email"
                  type="email"
                  defaultValue={userProfile.email}
                  {...register("email", {
                    required: "El correo electrónico es requerido",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "El email debe ser un correo válido",
                    },
                  })}
                  className={`mt-1 block w-full rounded-md border ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  } shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between space-x-4">
                <button
                  type="submit"
                  className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Actualizar Perfil
                </button>
                <button
                  type="button"
                  onClick={() => reset(userProfile)}
                  className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancelar Cambios
                </button>
              </div>
            </form>
          ) : (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
              <p className="text-gray-500 mt-2">Cargando perfil...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
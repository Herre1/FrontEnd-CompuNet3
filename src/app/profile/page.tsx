"use client";

import React, { useState, useEffect } from "react";
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

const UserProfile: React.FC = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      console.log("Token:", token); // Para debugging
      console.log("UserId:", userId); // Para debugging

      if (!token || !userId) {
        console.log("No hay token o userId");
        setError("No se encontró información de usuario");
        return;
      }

      try {
        const response = await axios.get(
          `https://proyecto-compunet-lll.onrender.com/users/${userId}`,
          {
            headers: { 
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
          }
        );
        
        console.log("Respuesta del servidor:", response.data); // Para debugging
        
        if (response.data) {
          setUserProfile(response.data);
        }
      } catch (error) {
        console.error("Error completo:", error); // Para debugging
        if (axios.isAxiosError(error)) {
          setError(error.response?.data?.message || "Error al cargar el perfil de usuario.");
        }
      }
    };

    fetchUserProfile();
  }, []); // Array de dependencias vacío para que solo se ejecute una vez

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
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Nombre Completo:</h3>
                <p className="text-gray-700">{userProfile.fullName}</p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">Correo Electrónico:</h3>
                <p className="text-gray-700">{userProfile.email}</p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">Estado:</h3>
                <p className="text-gray-700">{userProfile.isActive ? "Activo" : "Inactivo"}</p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">Roles:</h3>
                <ul className="text-gray-700">
                  {userProfile.roles.map((role, index) => (
                    <li key={index}>{role}</li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
              <p className="text-gray-500 mt-2">Cargando perfil...</p>
            </div>
          )}

          {/* Botón para volver a la página anterior */}
          <div className="mt-6">
            <button
              onClick={() => router.back()}
              className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors duration-200"
            >
              Volver
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
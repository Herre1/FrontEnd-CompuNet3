'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../store/AuthContext';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Navbar from '@/components/nav-bar/NavBar';

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
  type: string;
  createdAt: string;
  updatedAt: string;
  user: User;
  comment: Comment;
}

const UserReactions: React.FC = () => {
  const [reactions, setReactions] = useState<Reaction[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { token } = useAuth();

  useEffect(() => {
    const fetchUserReactions = async () => {
      if (!token) {
        setError("No se encontró token de autenticación");
        return;
      }

      const userId = localStorage.getItem("userId");
      if (!userId) {
        setError("User ID not found");
        return;
      }

      try {
        // Usar el endpoint específico para obtener las reacciones del usuario
        const response = await axios.get(
          `https://proyecto-compunet-lll.onrender.com/api/v1/reactions/user/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        console.log("Reacciones del usuario:", response.data);
        setReactions(response.data || []);
      } catch (error) {
        setError("Failed to load reactions");
        console.error("Error fetching reactions:", error);
      }
    };

    fetchUserReactions();
  }, [token]);

  return (
    <div className="min-h-screen flex">
      <div className="w-1/5 bg-gray-900">
        <Navbar />
      </div>

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
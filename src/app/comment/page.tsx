"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useAuth } from "../store/AuthContext";
import Navbar from "@/components/nav-bar/NavBar";
import { AiOutlineDelete } from "react-icons/ai";

interface Author {
  id?: string;
  username?: string;
  email?: string;
}

interface Comment {
  id: string;
  content: string;
  author?: Author;
  replies: Comment[];
  createdAt?: string;
}

const CommentsPage: React.FC = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchComments = async () => {
      if (!token) {
        router.push("/login");
        return;
      }

      const userId = localStorage.getItem("userId"); // Asegúrate de que el userId esté almacenado en el almacenamiento local
      if (!userId) {
        setError("User ID not found");
        return;
      }

      try {
        const response = await axios.get(
          `https://proyecto-compunet-lll.onrender.com/api/v1/comments/user/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("Comentarios recibidos:", response.data);
        setComments(response.data || []);
      } catch (error) {
        setError("Failed to load comments");
        console.error("Error fetching comments:", error);
      }
    };

    fetchComments();
  }, [token, router]);

  const handleDelete = async (commentId: string) => {
    try {
      const response = await axios.delete(
        `https://proyecto-compunet-lll.onrender.com/api/v1/comments/${commentId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        setComments((prevComments) =>
          prevComments.filter((comment) => comment.id !== commentId)
        );
      }
    } catch (error) {
      setError("Failed to delete comment");
      console.error("Error deleting comment:", error);
    }
  };

  const getInitial = (username?: string) => {
    return username ? username.charAt(0).toUpperCase() : "?";
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (error) {
    return <p className="text-red-500 p-4">{error}</p>;
  }

  return (
    <div className="flex min-h-screen">
      <div className="w-1/5 bg-gray-900">
        <Navbar />
      </div>

      <div className="flex-1 p-6 bg-gray-100">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">Mis Comentarios</h1>
        <div className="grid grid-cols-1 gap-6">
          {comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment.id} className="bg-white p-4 rounded-lg shadow-md">
                <div className="flex items-start justify-between border-b pb-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-xl text-gray-600">
                        {getInitial(comment.author?.fullName)}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        {comment.author?.fullName || "Usuario Anónimo"}
                      </h3>
                      {comment.createdAt && (
                        <span className="text-xs text-gray-500">
                          {formatDate(comment.createdAt)}
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(comment.id)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <AiOutlineDelete size={20} />
                  </button>
                </div>
                <p className="mt-3 text-gray-800">{comment.content}</p>

                {comment.replies && comment.replies.length > 0 && (
                  <div className="mt-4 space-y-3">
                    <h3 className="text-sm font-semibold text-gray-700">
                      Respuestas ({comment.replies.length})
                    </h3>
                    <div className="space-y-2 ml-6">
                      {comment.replies.map((reply) => (
                        <div
                          key={reply.id}
                          className="bg-gray-50 p-3 rounded-md border border-gray-200"
                        >
                          <div className="flex items-center space-x-2 mb-2">
                            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                              <span className="text-sm text-gray-600">
                                {getInitial(reply.author?.username)}
                              </span>
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-800">
                                {reply.author?.username || "Usuario Anónimo"}
                              </h4>
                              {reply.createdAt && (
                                <span className="text-xs text-gray-500">
                                  {formatDate(reply.createdAt)}
                                </span>
                              )}
                            </div>
                          </div>
                          <p className="text-gray-700 ml-10">{reply.content}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-8">No tienes comentarios aún.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentsPage;

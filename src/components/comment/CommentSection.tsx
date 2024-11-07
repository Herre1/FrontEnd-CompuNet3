// CommentSection.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { AiOutlineLike, AiOutlineDislike } from 'react-icons/ai';
import ShowRepliesButton from '../replies/ShowRepliesButton';
import { useAuth } from "../../app/store/AuthContext"; // Import actualizado

interface Comment {
  id: string;
  content: string;
  author: {
    fullName: string;
  };
  userReaction?: 'like' | 'dislike' | null;
  likeCount: number;
  dislikeCount: number;
  replies: Comment[];
  createdAt: string;
}

const CommentSection = ({ contentId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const { token } = useAuth();

  useEffect(() => {
    fetch(`https://proyecto-compunet-lll.onrender.com/api/v1/comments/content/${contentId}`)
      .then(response => response.json())
      .then(data => {
        const formattedData = data.map(comment => ({
          ...comment,
          likeCount: 0, // Inicializamos en 0, ya que el backend no lo proporciona
          dislikeCount: 0,
          userReaction: null // Inicializamos sin reacción
        }));
        setComments(formattedData);
      });
  }, [contentId]);

  const getInitial = (fullName: string) => {
    return fullName ? fullName.charAt(0).toUpperCase() : "?";
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleReaction = async (commentId: string, type: 'like' | 'dislike') => {
    const userId = localStorage.getItem("userId");

    try {
      const comment = comments.find(c => c.id === commentId);
      if (!comment) return;

      const existingReaction = comment.userReaction;

      if (existingReaction === type) {
        // Eliminar la reacción existente si el usuario hace clic en el mismo tipo de reacción
        await fetch(`https://proyecto-compunet-lll.onrender.com/api/v1/reactions/${commentId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setComments(prevComments =>
          prevComments.map(comment =>
            comment.id === commentId
              ? {
                  ...comment,
                  userReaction: null,
                  likeCount: type === 'like' ? comment.likeCount - 1 : comment.likeCount,
                  dislikeCount: type === 'dislike' ? comment.dislikeCount - 1 : comment.dislikeCount,
                }
              : comment
          )
        );
      } else {
        // Crear una nueva reacción si no existe o es de tipo diferente
        const response = await fetch(`https://proyecto-compunet-lll.onrender.com/api/v1/reactions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            userId,
            commentId,
            type
          })
        });

        if (response.ok) {
          const reaction = await response.json();
          setComments(prevComments =>
            prevComments.map(comment =>
              comment.id === commentId
                ? {
                    ...comment,
                    userReaction: type,
                    likeCount: type === 'like' ? comment.likeCount + 1 : comment.likeCount,
                    dislikeCount: type === 'dislike' ? comment.dislikeCount + 1 : comment.dislikeCount,
                  }
                : comment
            )
          );
        }
      }
    } catch (error) {
      console.error("Error handling reaction:", error);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Comentarios</h2>
      <div className="space-y-4">
        {comments.map(comment => (
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
            </div>
            <p className="mt-3 text-gray-800">{comment.content}</p>

            {/* Botones de reacción */}
            <div className="flex items-center mt-2 space-x-4">
              <button
                onClick={() => handleReaction(comment.id, 'like')}
                className={`flex items-center space-x-1 ${comment.userReaction === 'like' ? 'text-blue-600' : 'text-gray-600'}`}
              >
                <AiOutlineLike size={20} />
                <span>{comment.likeCount || 0}</span>
              </button>
              <button
                onClick={() => handleReaction(comment.id, 'dislike')}
                className={`flex items-center space-x-1 ${comment.userReaction === 'dislike' ? 'text-red-600' : 'text-gray-600'}`}
              >
                <AiOutlineDislike size={20} />
                <span>{comment.dislikeCount || 0}</span>
              </button>
            </div>

            {comment.replies && comment.replies.length > 0 && (
              <div className="mt-4 space-y-3">
                <h3 className="text-sm font-semibold text-gray-700">
                  Respuestas ({comment.replies.length})
                </h3>
                <div className="space-y-2 ml-6">
                  {comment.replies.map(reply => (
                    <div key={reply.id} className="bg-gray-50 p-3 rounded-md border border-gray-200">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                          <span className="text-sm text-gray-600">
                            {getInitial(reply.author?.fullName)}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-800">
                            {reply.author?.fullName || "Usuario Anónimo"}
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
            <ShowRepliesButton parentCommentId={comment.id} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentSection;
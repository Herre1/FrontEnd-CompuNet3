"use client";

import React, { useState, useEffect } from 'react';
import { AiOutlineLike, AiOutlineDislike } from 'react-icons/ai';
import { useAuth } from "../../app/store/AuthContext";
import axios from 'axios';

interface Comment {
  id: string;
  content: string;
  author: {
    fullName: string;
  };
  userReaction?: 'like' | 'dislike' | null;
  likeCount: number;
  dislikeCount: number;
  replies?: Comment[];
  createdAt: string;
}

interface CommentSectionProps {
  contentId: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({ contentId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState<string>("");
  const [replyContent, setReplyContent] = useState<string>('');
  const [activeCommentId, setActiveCommentId] = useState<string | null>(null);
  const [showReplies, setShowReplies] = useState<{ [key: string]: boolean }>({});
  const { token } = useAuth();

  // Cargar los comentarios principales del contenido con conteo de reacciones
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(`https://proyecto-compunet-lll.onrender.com/api/v1/comments/content/${contentId}`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
  
        const comments = response.data;
  
        // Solicita el conteo de likes y dislikes para cada comentario individualmente
        const commentsWithReactions = await Promise.all(
          comments.map(async (comment: Comment) => {
            const reactionResponse = await axios.get(
              `https://proyecto-compunet-lll.onrender.com/api/v1/reactions/count/${comment.id}`,
              { headers: { "Authorization": `Bearer ${token}` } }
            );
            const { likes, dislikes } = reactionResponse.data;
            return {
              ...comment,
              likeCount: likes,
              dislikeCount: dislikes,
              replies: comment.replies || [],  // Aseguramos que `replies` esté presente
              userReaction: comment.userReaction || null,
            };
          })
        );
  
        setComments(commentsWithReactions);
      } catch (error) {
        console.error("Error al cargar comentarios:", error);
      }
    };
  
    fetchComments();
  }, [contentId, token]);
  
  

  // Función para manejar el envío de un nuevo comentario
  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    const userId = localStorage.getItem("userId");
    const commentData = {
      userId,
      contentId,
      content: newComment,
    };

    try {
      const response = await axios.post("https://proyecto-compunet-lll.onrender.com/api/v1/comments", commentData, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.status === 201) {
        const createdComment = response.data;
        setComments(prev => [{ ...createdComment, replies: [], likeCount: 0, dislikeCount: 0 }, ...prev]);
        setNewComment("");
      }
    } catch (error) {
      console.error("Error al agregar el comentario:", error);
    }
  };

  // Función para manejar el envío de una respuesta a un comentario
  const handleReplySubmit = async (commentId: string) => {
    if (!replyContent) return;

    try {
      const response = await axios.post(`https://proyecto-compunet-lll.onrender.com/api/v1/comments/reply/${commentId}`, {
        content: replyContent,
        userId: localStorage.getItem("userId"),
        contentId: contentId
      }, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (response.status === 201) {
        const newReply = response.data;
        setComments(prevComments =>
          prevComments.map(comment =>
            comment.id === commentId
              ? { ...comment, replies: [...(comment.replies || []), newReply] }
              : comment
          )
        );
        setReplyContent('');
        setActiveCommentId(null);
      }
    } catch (error) {
      console.error("Error al enviar la respuesta", error);
    }
  };

  // Función para manejar las reacciones de like y dislike
  const handleReaction = async (commentId: string, type: 'like' | 'dislike') => {
    const userId = localStorage.getItem("userId");
    const reactionData = {
      commentId,
      userId,
      type,
    };

    try {
      const comment = comments.find(c => c.id === commentId);
      const hasReacted = comment?.userReaction === type;

      if (hasReacted) {
        await axios.delete(`https://proyecto-compunet-lll.onrender.com/api/v1/reactions/${commentId}`, {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        }); 
      } else {
        await axios.post("https://proyecto-compunet-lll.onrender.com/api/v1/reactions", reactionData, {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });
      }

      setComments(prev =>
        prev.map(c =>
          c.id === commentId
            ? {
                ...c,
                userReaction: hasReacted ? null : type,
                likeCount: hasReacted ? c.likeCount - 1 : type === 'like' ? c.likeCount + 1 : c.likeCount,
                dislikeCount: hasReacted ? c.dislikeCount - 1 : type === 'dislike' ? c.dislikeCount + 1 : c.dislikeCount,
              }
            : c
        )
      );
    } catch (error) {
      console.error("Error al manejar la reacción:", error);
    }
  };

  // Función para cargar las respuestas de un comentario específico
  const loadReplies = async (commentId: string) => {
    try {
      const response = await axios.get(`https://proyecto-compunet-lll.onrender.com/api/v1/comments/parent/${commentId}`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      const replies = response.data;

      setComments(prevComments =>
        prevComments.map(comment =>
          comment.id === commentId
            ? { ...comment, replies: replies }
            : comment
        )
      );
    } catch (error) {
      console.error("Error al cargar respuestas:", error);
    }
  };

  // Función para mostrar u ocultar respuestas
  const toggleReplies = (commentId: string) => {
    if (!showReplies[commentId]) {
      loadReplies(commentId);
    }
    setShowReplies(prev => ({
      ...prev,
      [commentId]: !prev[commentId]
    }));
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Comentarios</h2>

      {/* Formulario para agregar un nuevo comentario */}
      <div className="mt-4 bg-white p-4 rounded-lg shadow-md">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="w-full p-2 border border-gray-700 rounded-lg text-gray-800"
          placeholder="Escribe tu comentario..."
        />
        <button
          onClick={handleAddComment}
          className="mt-2 bg-blue-600 text-white py-2 px-4 rounded-lg"
        >
          Agregar Comentario
        </button>
      </div>

      <div className="space-y-4 mt-4">
        {comments.map(comment => (
          <div key={comment.id} className="bg-white p-4 rounded-lg shadow-md">
            {/* Renderizado del comentario */}
            <div className="flex items-start justify-between border-b pb-2">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-xl text-gray-600">
                    {comment.author.fullName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">
                    {comment.author.fullName || "Usuario Anónimo"}
                  </h3>
                  <span className="text-xs text-gray-500">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
            <p className="mt-3 text-gray-800">{comment.content}</p>

            {/* Botones de reacción con conteo */}
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

            {/* Botón para mostrar/ocultar respuestas */}
            <button onClick={() => toggleReplies(comment.id)} className="text-blue-600 mt-2">
              {showReplies[comment.id] ? "Ocultar Respuestas" : "Mostrar Respuestas"}
            </button>

            {/* Lista de respuestas */}
            {showReplies[comment.id] && comment.replies && comment.replies.length > 0 && (
              <div className="mt-4 space-y-3">
                <h3 className="text-sm font-semibold text-gray-700">
                  Respuestas ({comment.replies.length})
                </h3>
                <div className="space-y-2 ml-6">
                  {comment.replies.map(reply => (
                    <div key={reply.id} className="bg-gray-50 p-3 rounded-md border border-gray-200">
                      <p className="text-gray-700">{reply.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Formulario de respuesta */}
            {activeCommentId === comment.id && (
              <div>
                <input
                  type="text"
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Escribe tu respuesta..."
                  className="w-full mt-2 p-2 border border-gray-700 text-black rounded-lg"
                />
                <button
                  onClick={() => handleReplySubmit(comment.id)}
                  className="mt-2 bg-green-600 text-white py-1 px-4 rounded-lg"
                >
                  Enviar Respuesta
                </button>
              </div>
            )}
            <button onClick={() => setActiveCommentId(comment.id)} className="mt- text-blue-600 px-4">
               Responder
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentSection;

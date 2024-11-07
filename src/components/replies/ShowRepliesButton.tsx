// ShowRepliesButton.tsx
"use client";

import React, { useState, useEffect } from 'react';

const ShowRepliesButton = ({ parentCommentId }) => {
  const [replies, setReplies] = useState([]);
  const [showReplies, setShowReplies] = useState(false);

  const toggleReplies = () => {
    if (!showReplies) {
      // Fetch comments where parentComment matches the parentCommentId
      fetch(`https://proyecto-compunet-lll.onrender.com/api/v1/comments/parent/${parentCommentId}`)
        .then(response => response.json())
        .then(data => {
          // Asegurarse de que 'data' es un array
          setReplies(Array.isArray(data) ? data : []);
        })
        .catch(error => {
          console.error("Error fetching replies:", error);
          setReplies([]); // Inicializar como array vacío en caso de error
        });
    }
    setShowReplies(!showReplies);
  };

  return (
    <div>
      <button onClick={toggleReplies} className="text-blue-600 mt-2 flex items-center">
        <span className="text-sm">{showReplies ? 'Ocultar respuestas' : `${replies.length} respuestas`}</span>
        <span className={`transform ${showReplies ? 'rotate-180' : 'rotate-0'} ml-1`}>▼</span>
      </button>
      
      {/* Renderizar las respuestas si están visibles */}
      {showReplies && (
        <div className="pl-8 mt-2 space-y-3">
          {replies.map(reply => (
            <div key={reply.id} className="bg-gray-50 p-3 rounded-md border border-gray-200">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-sm text-gray-600">
                    {reply.author?.fullName ? reply.author.fullName.charAt(0).toUpperCase() : "?"}
                  </span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">
                    {reply.author?.fullName || "Usuario Anónimo"}
                  </h4>
                  {reply.createdAt && (
                    <span className="text-xs text-gray-500">
                      {new Date(reply.createdAt).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  )}
                </div>
              </div>
              <p className="text-gray-700 ml-10">{reply.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ShowRepliesButton;
"use client";

import React, { useState, useEffect } from 'react';

const ShowRepliesButton = ({ commentId }) => {
  const [replies, setReplies] = useState([]);
  const [showReplies, setShowReplies] = useState(false);

  const toggleReplies = () => {
    if (!showReplies) {
      fetch(`/api/comments/${commentId}/replies`)
        .then(response => response.json())
        .then(data => setReplies(data));
    }
    setShowReplies(!showReplies);
  };

  return (
    <div>
      <button onClick={toggleReplies}>Respuestas</button>
      {showReplies && (
        <div className="replies">
          {replies.map(reply => (
            <p key={reply.id}>{reply.text}</p>
          ))}
        </div>
      )}
    </div>
  );
};

export default ShowRepliesButton;
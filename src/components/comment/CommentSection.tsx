"use client";

import React, { useState, useEffect } from 'react';
import ShowRepliesButton from '../replies/ShowRepliesButton';

const CommentSection = ({ contentId }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(`/api/content/${contentId}/comments`);
        if (!response.ok) throw new Error("Error fetching comments");
        const data = await response.json();
        setComments(data);
      } catch (error) {
        console.error("Failed to load comments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [contentId]);

  if (loading) return <p className='text-gray-800'>Loading comments...</p>;
  if (comments.length === 0) return <p className='text-gray-800'>No comments yet.</p>;

  return (
    <div>
      <h2 className="text-gray-800 font-bold text-xl mb-4">Comments</h2>
      {comments.map(comment => (
        <div key={comment.id} className="border-b border-gray-200 mb-4 pb-4">
          <p className="text-gray-600 mb-2">
            <strong>{comment.author?.name || "Anonymous"}:</strong> {comment.content}
          </p>
          <ShowRepliesButton commentId={comment.id} />
        </div>
      ))}
    </div>
  );
};

export default CommentSection;
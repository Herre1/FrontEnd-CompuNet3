// AddToListButton.tsx
"use client";

import React from 'react';
import { AiOutlineStar } from 'react-icons/ai';

const AddToListButton = ({ contentId }) => {
  const handleAddToList = () => {
    const userId = localStorage.getItem("userId"); // Asegúrate de tener el userId en localStorage
    fetch(`https://proyecto-compunet-lll.onrender.com/api/v1/lists/addcontent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contentId, userId }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          alert("Contenido agregado a tu lista!");
        }
      });
  };

  return (
    <button onClick={handleAddToList} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
      {/* Icono de estrella */}
      <AiOutlineStar size={20} />
    </button>
  );
};

export default AddToListButton;
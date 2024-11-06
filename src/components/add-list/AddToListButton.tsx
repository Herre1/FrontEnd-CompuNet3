"use client";

import React from 'react';

const AddToListButton = ({ contentId, icon }) => {
  const handleAddToList = () => {
    fetch(`/api/user/add-to-list`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contentId }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          alert("Added to your list!");
        }
      });
  };

  return (
    <button onClick={handleAddToList} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center">
      {icon}
    </button>
  );
};

export default AddToListButton;
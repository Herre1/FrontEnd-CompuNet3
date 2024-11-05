"use client";

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import axios from 'axios';

interface Content {
  id: string;
  title: string;
}

interface CreateListForm {
  contentIds: string[];
  status: string;
}

const CreateList: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<CreateListForm>();
  const [contentList, setContentList] = useState<Content[]>([]);
  const [error, setError] = useState<string>('');
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();

  // Obtener el contenido desde la API y el userId desde localStorage
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await axios.get('https://proyecto-compunet-lll.onrender.com/api/v1/content');
        setContentList(response.data);
      } catch (err) {
        setError('Failed to load content');
      }
    };

    fetchContent();

    // Leer userId desde localStorage en el cliente
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  // Función para manejar el envío del formulario
  const onSubmit = async (data: CreateListForm) => {
    if (!userId) {
      setError('User not logged in');
      return;
    }

    try {
      const response = await axios.post('https://proyecto-compunet-lll.onrender.com/api/v1/lists', {
        userId,
        contentIds: data.contentIds,
        status: data.status,
      });

      if (response.status === 201) {
        router.push('/lists');
      }
    } catch (err) {
      setError('Failed to create list');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-gray-900 text-center">Create New List</h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <h3 className="block text-sm font-medium text-gray-700">Select Content</h3>
            {contentList.map((content) => (
              <div key={content.id} className="flex items-center mb-2">
                <input
                  id={content.id}
                  type="checkbox"
                  value={content.id}
                  {...register('contentIds', {
                    required: 'At least one content is required',
                  })}
                  className="mr-2"
                />
                <label htmlFor={content.id} className="text-sm">{content.title}</label>
              </div>
            ))}
            {errors.contentIds && (
              <p className="mt-1 text-sm text-red-600">{errors.contentIds.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <input
              id="status"
              type="text"
              {...register('status', {
                required: 'Status is required',
                minLength: { value: 3, message: 'Status must be at least 3 characters' },
              })}
              className={`mt-1 block w-full rounded-md border ${errors.status ? 'border-red-500' : 'border-gray-300'} shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
            />
            {errors.status && (
              <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-md p-3 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Create List
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateList;

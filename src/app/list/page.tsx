// pages/userLists.tsx
"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useAuth } from '../store/AuthContext';

interface Content {
  id: string;
  title: string;
  description: string;
}

interface List {
  id: string;
  contents: Content[];
  status: string;
}

const UserLists: React.FC = () => {
  const [lists, setLists] = useState<List[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { token } = useAuth();

  useEffect(() => {
    const fetchUserLists = async () => {
      if (!token) {
        router.push('/login');
        return;
      }

      // Obtén el `userId` desde `localStorage`
      const userId = localStorage.getItem('userId');
      if (!userId) {
        setError('User ID not found');
        return;
      }

  try {
    const response = await axios.get(`https://proyecto-compunet-lll.onrender.com/api/v1/lists/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("Data de listas recibida:", response.data); // Revisa si `contents` contiene los datos
    setLists(response.data);
  } catch (error) {
    setError('Failed to load lists');
  }

    };

    fetchUserLists();
  }, [token, router]);

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h1>Your Lists</h1>
      {lists.map((list) => (
        <div key={list.id}>
          <h2>Status: {list.status}</h2>
          <ul>
            {(list.contents || []).map((content) => (
              <li key={content.id}>
                <h3>{content.title}</h3>
                <p>{content.description}</p>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );  
};

export default UserLists;
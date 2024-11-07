"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useAuth } from "../store/AuthContext";
import Navbar from "@/components/nav-bar/NavBar"; // Asegúrate de tener la referencia correcta de Navbar
import { AiOutlineSearch } from "react-icons/ai"; // Icono de búsqueda

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
  const [filteredLists, setFilteredLists] = useState<List[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { token } = useAuth();
  

  useEffect(() => {
    const fetchUserLists = async () => {
      console.log('token de useAuth ' + token)

      if (!token) {
        router.push("/login");
        return;
      }

      const userId = localStorage.getItem("userId");
      if (!userId) {
        setError("User ID not found");
        return;
      }

      try {
        const response = await axios.get(
          `https://proyecto-compunet-lll.onrender.com/api/v1/lists/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("Data de listas recibida:", response.data);
        response.data.forEach((list: List) => {
          console.log(`Lista ID: ${list.id}, Contents:`, list.contents);
        });
        console.log("Respuesta completa de la API:", response.data);

        setLists(response.data || []);  // Asegurándote de que lists sea un array vacío si no se recibe nada
        setFilteredLists(response.data || []);  // Lo mismo para filteredLists
      } catch (error) {
        setError("Failed to load lists");
      }
    };

    fetchUserLists();
  }, [token, router]);
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    
  
    const filtered = lists.filter((list) =>
      list.status.toLowerCase().includes(term) ||
      list.id.toString().toLowerCase().includes(term) ||  // convert id to string if necessary
      
      list.contents.some(
        (content) =>
          content.title.toLowerCase().includes(term) ||
          content.description.toLowerCase().includes(term)
      )
      
    );
  
    setFilteredLists(filtered);
  };
  
  return (
    <div className="flex min-h-screen">
      {/* Sidebar con Navbar */}
      <div className="w-1/5 bg-gray-900">
        <Navbar />
      </div>
  
      {/* Contenido Principal */}
      <div className="flex-1 p-6 bg-gray-100">
        <div className="flex items-center mb-6">
          <img src="/logo.png" alt="Logo" className="w-10 h-10 mr-4" />
          <div className="relative flex items-center w-full max-w-lg">
            <AiOutlineSearch className="absolute left-3 text-gray-500" />
            <input
              type="text"
              placeholder="Buscar listas o contenidos..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
  
        <h1 className="text-2xl font-bold mb-4 text-gray-800">Tus Listas</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLists.length > 0 ? (
            filteredLists.map((list) => (
              <div
                key={list.id}
                className="bg-white p-4 rounded-lg shadow-md hover:shadow-xl transition-shadow"
              >
                <h2 className="text-xl font-semibold mb-2 text-gray-800">
                  Estado: {list.status}
                </h2>
                <p className="text-gray-600 mb-2">ID: {list.id}</p>
  
                {/* Contenido de la lista */}
                <ul className="space-y-4">
                  {list.contents && list.contents.length > 0 ? (
                    list.contents.map((content) => (
                      <li
                        key={content.id}
                        className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                      >
                        <h3 className="text-lg font-medium text-gray-700">
                          {content.title}
                        </h3>
                        <p className="text-gray-600">{content.description}</p>
                      </li>
                    ))
                  ) : (
                    <p className="text-gray-500">No hay contenidos disponibles.</p>
                  )}
                </ul>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No se encontraron listas que coincidan con tu búsqueda.</p>
          )}
        </div>
      </div>
    </div>
  );
} 

export default UserLists;

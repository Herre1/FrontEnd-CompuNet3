"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import ContentCard from "@/components/content/ContentCard";
import { useRouter } from "next/navigation";
import Navbar from "@/components/nav-bar/NavBar";
import { AiOutlineSearch } from "react-icons/ai";

const HomePage = () => {
  const [contents, setContents] = useState([]);
  const [filteredContents, setFilteredContents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAuthorizedUser, setIsAuthorizedUser] = useState(false); // Nuevo estado
  const router = useRouter();

  useEffect(() => {
    // Verificar si el usuario actual es el autorizado
    const userRole = localStorage.getItem("roles");
    setIsAuthorizedUser(userRole === "admin");

    // Obtener los contenidos desde la API
    const fetchContents = async () => {
      const response = await fetch("https://proyecto-compunet-lll.onrender.com/api/v1/content");
      const data = await response.json();
      setContents(data);
      setFilteredContents(data);
    };
    fetchContents();
  }, []);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = contents.filter((content) =>
      content.title.toLowerCase().includes(term) ||
      content.type.toLowerCase().includes(term)
    );
    setFilteredContents(filtered);
  };

  const handleAddContent = () => {
    if (isAuthorizedUser) router.push('/home/add-content');
  };

  const handleEditContent = (id: string) => {
    if (isAuthorizedUser) router.push(`/home/edit-content/${id}`);
  };

  const handleDeleteContent = async (id: string) => {
    if (isAuthorizedUser) {
      try {
        await axios.delete(
            `https://proyecto-compunet-lll.onrender.com/api/v1/content/${id}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                "Content-Type": "application/json",
              },
            }
          );

      const updatedContents = contents.filter(content => content.id !== id);
      setContents(updatedContents);
      setFilteredContents(updatedContents);
    } catch (error) {
        console.log(error)
    }
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar with Navbar */}
      <div className="w-1/5 bg-gray-900">
        <Navbar />
      </div>

      {/* Main Content */}
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

          {/* Add Content Button - Visible only for authorized user */}
          {isAuthorizedUser && (
            <button
              onClick={handleAddContent}
              className="ml-4 px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-colors duration-300"
            >
              Añadir Contenido
            </button>
          )}
        </div>

        <h1 className="text-2xl font-bold mb-4 text-gray-800">Todos los Contenidos</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContents.map((content) => (
            <div key={content.id} className="relative">
              <ContentCard
                id={content.id}
                title={content.title}
                type={content.type}
              />
              
              {/* Edit and Delete buttons - Visible only for authorized user */}
              {isAuthorizedUser && (
                <div className="absolute top-2 right-2 space-x-2">
                  <button
                    onClick={() => handleEditContent(content.id)}
                    className="px-2 py-1 text-white bg-yellow-500 rounded hover:bg-yellow-600"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDeleteContent(content.id)}
                    className="px-2 py-1 text-white bg-red-500 rounded hover:bg-red-600"
                  >
                    Eliminar
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;

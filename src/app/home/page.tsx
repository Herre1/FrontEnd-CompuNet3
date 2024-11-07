"use client";

import { useEffect, useState } from "react";
import ContentCard from "@/components/content/ContentCard";
import axios from "axios";
import { useRouter } from "next/navigation";
import Navbar from "@/components/nav-bar/NavBar";
import { AiOutlineSearch } from "react-icons/ai";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../store/store";
import {
  fetchContents,
  setSearchTerm,
  setSelectedType,
  setSelectedGenre,
  setSelectedRating,
  filterContent,
} from "../store/contentSlice";

const HomePage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { filteredContents, searchTerm, selectedType, selectedGenre, selectedRating } = useSelector(
    (state: RootState) => state.content
  );
  const [isAuthorizedUser, setIsAuthorizedUser] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const userRole = localStorage.getItem("roles");
    setIsAuthorizedUser(userRole === "admin");

    dispatch(fetchContents());
  }, [dispatch]);

  useEffect(() => {
    dispatch(filterContent());
  }, [searchTerm, selectedType, selectedGenre, selectedRating, dispatch]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchTerm(event.target.value));
  };

  const handleAddContent = () => {
    if (isAuthorizedUser) router.push("/home/add-content");
  };

  const handleEditContent = (id: string) => {
    if (isAuthorizedUser) router.push(`/home/edit-content/${id}`);
  };

  const handleDeleteContent = async (id: string) => {
    if (isAuthorizedUser) {
      try {
        await axios.delete(`https://proyecto-compunet-lll.onrender.com/api/v1/content/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        });
        dispatch(fetchContents()); // Refrescar la lista después de eliminar
      } catch (error) {
        console.error("Error al eliminar contenido:", error);
      }
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="w-1/5 bg-gray-900">
        <Navbar />
      </div>
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
              className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600"
            />
          </div>
          {isAuthorizedUser && (
            <button
              onClick={handleAddContent}
              className="ml-4 px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-colors duration-300"
            >
              Añadir Contenido
            </button>
          )}
        </div>

        <div className="flex space-x-4 mb-4">
          <select
            value={selectedType}
            onChange={(e) => dispatch(setSelectedType(e.target.value))}
            className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600"
          >
            <option value="">Tipos</option>
            <option value="movie">Película</option>
            <option value="series">Serie</option>
            <option value="anime">Anime</option>
          </select>

          <select
            value={selectedGenre}
            onChange={(e) => dispatch(setSelectedGenre(e.target.value))}
            className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600"
          >
            <option value="">Géneros</option>
            <option value="Action">Acción</option>
            <option value="Comedy">Comedia</option>
            <option value="Thriller">Thriller</option>
            <option value="Drama">Drama</option>
          </select>

          <select
            value={selectedRating}
            onChange={(e) => dispatch(setSelectedRating(e.target.value))}
            className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600"
          >
            <option value="">Calificación</option>
            {[...Array(10)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
        </div>

        <h1 className="text-2xl font-bold mb-4 text-gray-800">Todos los Contenidos</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContents.map((content) => (
            <div key={content.id} className="relative">
              <ContentCard id={content.id} title={content.title} type={content.type} imageUrl={content.imageUrl} />
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

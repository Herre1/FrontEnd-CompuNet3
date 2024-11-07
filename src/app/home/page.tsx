// home/page.tsx
"use client";

import { useEffect } from "react";
import ContentCard from "@/components/content/ContentCard";
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

  useEffect(() => {
    dispatch(fetchContents());
  }, [dispatch]);

  useEffect(() => {
    dispatch(filterContent());
  }, [searchTerm, selectedType, selectedGenre, selectedRating, dispatch]);

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
              placeholder="Buscar contenidos..."
              value={searchTerm}
              onChange={(e) => dispatch(setSearchTerm(e.target.value))}
              className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600"
            />
          </div>
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
            {/* otros géneros */}
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
            <ContentCard key={content.id} id={content.id} title={content.title} type={content.type} imageUrl={content.imageUrl} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
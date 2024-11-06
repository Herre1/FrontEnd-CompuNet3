"use client";

import { useEffect, useState } from "react";
import ContentCard from "@/components/content/ContentCard";
import Navbar from "@/components/nav-bar/NavBar";
import { AiOutlineSearch } from "react-icons/ai";

const HomePage = () => {
  const [contents, setContents] = useState([]);
  const [filteredContents, setFilteredContents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [selectedRating, setSelectedRating] = useState("");

  const genres = ["Action", "Comedy", "Horror", "Romance", "Drama", "Science fiction", "Adventure", "Fantasy", "Thriller", "Crime"];
  const contentTypes = ["movie", "series", "anime"];
  const ratings = Array.from({ length: 10 }, (_, i) => i + 1);

  useEffect(() => {
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
    filterContent(term, selectedType, selectedGenre, selectedRating);
  };

  const handleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const type = event.target.value;
    setSelectedType(type);
    filterContent(searchTerm, type, selectedGenre, selectedRating);
  };

  const handleGenreChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const genre = event.target.value;
    setSelectedGenre(genre);
    filterContent(searchTerm, selectedType, genre, selectedRating);
  };

  const handleRatingChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const rating = event.target.value;
    setSelectedRating(rating);
    filterContent(searchTerm, selectedType, selectedGenre, rating);
  };

  const filterContent = (term: string, type: string, genre: string, rating: string) => {
    const filtered = contents.filter((content) => {
      const matchesTitle = content.title.toLowerCase().includes(term);
      const matchesType = type === "" || content.type === type;
      const matchesGenre = genre === "" || content.genre.includes(genre);
      const matchesRating = rating === "" || content.rating === parseInt(rating, 10);

      // Búsqueda adicional por actores, director (como cadena), estudio o compañía de producción
      const matchesActors = content.actors && content.actors.some((actor: string) => actor.toLowerCase().includes(term));
      const matchesDirector = content.director && content.director.toLowerCase().includes(term); // Tratar `director` como una cadena
      const matchesStudio = content.studio && content.studio.toLowerCase().includes(term);
      const matchesProductionCompany = content.productionCompany && content.productionCompany.toLowerCase().includes(term);

      return (
        matchesTitle ||
        matchesActors ||
        matchesDirector || // Ahora busca correctamente en `director` como una cadena de texto
        matchesStudio ||
        matchesProductionCompany
      ) && matchesType && matchesGenre && matchesRating;
    });
    setFilteredContents(filtered);
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar with Navbar */}
      <div className="w-1/5 bg-gray-900">
        <Navbar />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 bg-gray-100">
        {/* Search Bar with Icon */}
        <div className="flex items-center mb-6">
          <img src="/logo.png" alt="Logo" className="w-10 h-10 mr-4" />
          <div className="relative flex items-center w-full max-w-lg">
            <AiOutlineSearch className="absolute left-3 text-gray-500" />
            <input
              type="text"
              placeholder="Buscar contenidos..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600"
            />
          </div>
        </div>

        {/* Advanced Search Filters */}
        <div className="flex space-x-4 mb-4">
          {/* Dropdown for Type */}
          <select
            value={selectedType}
            onChange={handleTypeChange}
            className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600"
          >
            <option value="">Tipos</option>
            {contentTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>

          {/* Dropdown for Genre */}
          <select
            value={selectedGenre}
            onChange={handleGenreChange}
            className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600"
          >
            <option value="">Géneros</option>
            {genres.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>

          {/* Dropdown for Rating */}
          <select
            value={selectedRating}
            onChange={handleRatingChange}
            className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600"
          >
            <option value="">Calificación</option>
            {ratings.map((rating) => (
              <option key={rating} value={rating}>
                {rating}
              </option>
            ))}
          </select>
        </div>

        <h1 className="text-2xl font-bold mb-4 text-gray-800">Todos los Contenidos</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContents.map((content) => (
            <ContentCard
              key={content.id}
              id={content.id}
              title={content.title}
              type={content.type}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
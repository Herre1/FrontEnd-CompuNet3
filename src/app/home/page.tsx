"use client";

import { useEffect, useState } from "react";
import ContentCard from "@/components/content/ContentCard";
import Navbar from "@/components/nav-bar/NavBar";
import { AiOutlineSearch } from "react-icons/ai";

const HomePage = () => {
  const [contents, setContents] = useState([]);
  const [filteredContents, setFilteredContents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

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
    const filtered = contents.filter((content) =>
      content.title.toLowerCase().includes(term) ||
      content.type.toLowerCase().includes(term)
    );
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
        <div className="flex items-center mb-6">
          <img src="/logo.svg" alt="Logo" className="w-10 h-10 mr-4" />
          <div className="relative flex items-center w-full max-w-lg">
            <AiOutlineSearch className="absolute left-3 text-gray-500" />
            <input
              type="text"
              placeholder="Buscar contenidos..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
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
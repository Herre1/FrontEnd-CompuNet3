"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter, useParams } from "next/navigation";
import Navbar from "@/components/nav-bar/NavBar";
import { uploadImageToCloudinary } from "@/utils/cloudinary";

const EditContentPage: React.FC = () => {
  const [contentData, setContentData] = useState({
    title: "",
    genre: [""],
    year: 2022,
    actors: [""],
    description: "",
    type: "movie",
    director: "",
    seasons: undefined,
    episodes: undefined,
    studio: "",
    productionCompany: "",
    rating: 0,
    imageUrl: "", // Campo para la URL de la imagen actual
  });
  const [imageFile, setImageFile] = useState<File | null>(null); // Nuevo estado para la imagen
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { id } = useParams();

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await axios.get(`https://proyecto-compunet-lll.onrender.com/api/v1/content/${id}`);
        setContentData(response.data);
      } catch (error) {
        console.log("Error fetching content:", error);
      }
    };
    fetchContent();
  }, [id]);

  const handleChange = (e: any) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setImageFile(files[0]);
    } else {
      setContentData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const handleArrayChange = (field: string, index: number, value: string) => {
    setContentData((prevData: any) => {
      const newArray = [...(prevData[field] as string[])];
      newArray[index] = value;
      return { ...prevData, [field]: newArray };
    });
  };

  const handleAddField = (field: string) => {
    setContentData((prevData: any) => ({
      ...prevData,
      [field]: [...(prevData[field] as string[]), ""],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    try {
      let imageUrl = contentData.imageUrl;
      if (imageFile) {
        const uploadResponse = await uploadImageToCloudinary(imageFile);
        imageUrl = uploadResponse.secure_url;
      }

      const { id, ...restContentData } = contentData;
      const formattedData = {
        ...restContentData,
        genre: contentData.genre.filter((g) => g.trim() !== ""),
        actors: contentData.actors.filter((a) => a.trim() !== ""),
        rating: Number(contentData.rating),
        imageUrl, // Agregar la URL de la imagen
      };

      await axios.patch(`https://proyecto-compunet-lll.onrender.com/api/v1/content/${id}`, formattedData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      router.push("/home");
    } catch (error) {
      console.log("Error updating content:", error);
      setError("Error al actualizar contenido");
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="w-1/5 bg-gray-900">
        <Navbar />
      </div>
      <div className="flex-1 p-6 bg-gray-100">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Editar Contenido</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-md shadow-md space-y-4">
          {/* Título */}
          <div>
            <label className="block text-gray-700">Título</label>
            <input
              type="text"
              name="title"
              value={contentData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border text-gray-600 rounded-md"
            />
          </div>

          {/* Género */}
          <div>
            <label className="block text-gray-700">Género</label>
            {contentData.genre.map((genre, index) => (
              <input
                key={index}
                type="text"
                value={genre}
                onChange={(e) => handleArrayChange("genre", index, e.target.value)}
                className="w-full text-gray-600 px-3 py-2 border rounded-md mb-2"
              />
            ))}
            <button
              type="button"
              onClick={() => handleAddField("genre")}
              className="text-blue-500 hover:text-blue-700"
            >
              + Añadir género
            </button>
          </div>

          {/* Año */}
          <div>
            <label className="block text-gray-700">Año</label>
            <input
              type="number"
              name="year"
              value={contentData.year}
              onChange={handleChange}
              className="w-full px-3 text-gray-600 py-2 border rounded-md"
            />
          </div>

          {/* Actores */}
          <div>
            <label className="block text-gray-700">Actores</label>
            {contentData.actors.map((actor, index) => (
              <input
                key={index}
                type="text"
                value={actor}
                onChange={(e) => handleArrayChange("actors", index, e.target.value)}
                className="w-full px-3 py-2 text-gray-600 border rounded-md mb-2"
              />
            ))}
            <button
              type="button"
              onClick={() => handleAddField("actors")}
              className="text-blue-500 hover:text-blue-700"
            >
              + Añadir actor
            </button>
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-gray-700">Descripción</label>
            <textarea
              name="description"
              value={contentData.description}
              onChange={handleChange}
              className="w-full px-3 py-2 text-gray-600 border rounded-md"
            />
          </div>

          {/* Tipo */}
          <div>
            <label className="block text-gray-700">Tipo</label>
            <select
              name="type"
              value={contentData.type}
              onChange={handleChange}
              className="w-full px-3 text-gray-600 py-2 border rounded-md"
            >
              <option value="movie">Película</option>
              <option value="series">Serie</option>
              <option value="anime">Anime</option>
            </select>
          </div>

          {/* Director */}
          <div>
            <label className="block text-gray-700">Director</label>
            <input
              type="text"
              name="director"
              value={contentData.director}
              onChange={handleChange}
              className="w-full px-3 text-gray-600 py-2 border rounded-md"
            />
          </div>

          {/* Campos Condicionales */}
          {contentData.type === "series" && (
            <>
              <div>
                <label className="block text-gray-700">Temporadas</label>
                <input
                  type="number"
                  name="seasons"
                  value={contentData.seasons || ""}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-gray-600 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-gray-700">Episodios</label>
                <input
                  type="number"
                  name="episodes"
                  value={contentData.episodes || ""}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-gray-600 border rounded-md"
                />
              </div>
            </>
          )}

          {contentData.type === "anime" && (
            <div>
              <label className="block text-gray-700">Estudio</label>
              <input
                type="text"
                name="studio"
                value={contentData.studio || ""}
                onChange={handleChange}
                className="w-full px-3 py-2 text-gray-600 border rounded-md"
              />
            </div>
          )}

          {/* Imagen */}
          <div>
            <label className="block text-gray-700">Imagen</label>
            <input
              type="file"
              name="image"
              onChange={handleChange}
              className="w-full text-gray-600 px-3 py-2 border rounded-md mb-2"
            />
          </div>

          {/* Rating */}
          <div>
            <label className="block text-gray-700">Rating</label>
            <input
              type="number"
              name="rating"
              value={contentData.rating}
              onChange={handleChange}
              className="w-full px-3 py-2 text-gray-600 border rounded-md"
              step="0.1"
            />
          </div>

          <button type="submit" className="w-full bg-blue-500 rounded-md hover:bg-blue-600 text-white py-2">
            Guardar Cambios
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditContentPage;

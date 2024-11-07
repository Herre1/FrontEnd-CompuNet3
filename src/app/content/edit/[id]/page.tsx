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
    imageUrl: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
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
        imageUrl,
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
          {/* Resto del formulario */}
          {/* Botón de guardar cambios */}
          <button type="submit" className="w-full bg-blue-500 rounded-md hover:bg-blue-600 text-white py-2">
            Guardar Cambios
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditContentPage;
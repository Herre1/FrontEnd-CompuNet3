"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Navbar from "@/components/nav-bar/NavBar";
import AddToListButton from "@/components/add-list/AddToListButton";
import CommentSection from "@/components/comment/CommentSection";
import { AiOutlineStar, AiOutlineEdit, AiOutlineDelete, AiOutlineArrowLeft } from "react-icons/ai";
import axios from "axios";

const ContentDetails = () => {
    const { id } = useParams();
    const router = useRouter();
    const [content, setContent] = useState(null);
    const [isAuthorizedUser, setIsAuthorizedUser] = useState(false);

    useEffect(() => {
        // Verificar si el usuario actual es admin
        const userRole = localStorage.getItem("roles");
        console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaarrrozzz")
        console.log(userRole)
        setIsAuthorizedUser(userRole === "admin");

        // Obtener detalles del contenido
        const fetchContentDetails = async () => {
            const response = await fetch(`https://proyecto-compunet-lll.onrender.com/api/v1/content/${id}`);
            const data = await response.json();
            setContent(data);
        };
        fetchContentDetails();
    }, [id]);

    const handleDelete = async () => {
        if (!isAuthorizedUser) return;

        try {
            await axios.delete(`https://proyecto-compunet-lll.onrender.com/api/v1/content/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json",
                },
            });
            alert("Contenido eliminado correctamente.");
            router.push("/home");
        } catch (error) {
            console.error("Error al eliminar contenido:", error);
        }
    };

    const handleModify = () => {
        if (isAuthorizedUser) {
            router.push(`/home/edit-content/${id}`);
        }
    };

    if (!content) return <p>Loading...</p>;

    return (
        <div className="flex min-h-screen">
            {/* Navbar a la izquierda */}
            <div className="w-1/5 bg-gray-900">
                <Navbar />
            </div>

            {/* Contenido principal */}
            <div className="flex-1 p-6 bg-gray-100">
                <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
                    {/* Botones de acciones alineados */}
                    <div className="flex items-center justify-between mb-4">
                        <button onClick={() => router.back()} className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                            <AiOutlineArrowLeft size={20} className="mr-2" />
                            Volver
                        </button>
                    </div>

                    {/* Imagen por defecto */}
                    <img src={content.imageUrl || "https://via.placeholder.com/600x400"} alt={content.title} className="w-full h-64 object-cover mb-4 rounded-lg" />

                    {/* Detalles del contenido */}
                    <h1 className="text-3xl font-bold mb-2 text-gray-800">{content.title}</h1>
                    <p className="text-gray-600 mb-4"><strong>Director:</strong> {content.director}</p>
                    <p className="text-gray-600 mb-4"><strong>Año:</strong> {content.year}</p>
                    <p className="text-gray-600 mb-4"><strong>Calificación:</strong> {content.rating}</p>
                    <p className="text-gray-600 mb-4"><strong>Género:</strong> {content.genre.join(", ")}</p>
                    <p className="text-gray-600 mb-4"><strong>Descripción:</strong> {content.description}</p>
                    <p className="text-gray-600 mb-4"><strong>Tipo:</strong> {content.type}</p>

                    {/* Campos opcionales */}
                    {content.actors && content.actors.length > 0 && (
                        <p className="text-gray-600 mb-4"><strong>Actores:</strong> {content.actors.join(", ")}</p>
                    )}
                    {content.seasons && (
                        <p className="text-gray-600 mb-4"><strong>Temporadas:</strong> {content.seasons}</p>
                    )}
                    {content.episodes && (
                        <p className="text-gray-600 mb-4"><strong>Episodios:</strong> {content.episodes}</p>
                    )}
                    {content.studio && (
                        <p className="text-gray-600 mb-4"><strong>Estudio:</strong> {content.studio}</p>
                    )}
                    {content.productionCompany && (
                        <p className="text-gray-600 mb-4"><strong>Compañía de Producción:</strong> {content.productionCompany}</p>
                    )}

                    {/* Sección de comentarios */}
                    <div className="mt-8">
                        <CommentSection contentId={content.id} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContentDetails;
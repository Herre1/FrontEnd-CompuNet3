// Navbar.tsx
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AiOutlineAppstore, AiOutlineHome } from "react-icons/ai";
import { FiUser, FiLogOut } from "react-icons/fi";
import { RiEmotionLine, RiFileList2Fill } from "react-icons/ri";

const Navbar = () => {
  const [username, setUsername] = useState("");
  const router = useRouter();

  useEffect(() => {
    const savedUsername = localStorage.getItem("fullName") || "Usuario";
    setUsername(savedUsername);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    router.push("/login");
  };

  return (
    <div className="flex flex-col h-full p-4 bg-gray-800 text-white">
      <div className="flex flex-col items-center mb-6">
        <img src="/logo.png" alt="Logo" className="w-16 h-16 mb-4" />
        <span className="text-lg font-semibold">Bienvenido, {username}</span>
      </div>

            <div className="flex-1 space-y-4 w-full">
        <Link href="/home" className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded-md">
          <AiOutlineHome size={24} />
          Inicio
        </Link>
        <Link href="/list" className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded-md">
          <RiFileList2Fill size={24} />
          Mi Lista
        </Link>
        
        {/* Mis Comentarios con icono */}
        <Link href="/comment" className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded-md">
          <FiUser size={24} /> {/* Aquí puedes usar un icono de react-icons */}
          Mis Comentarios
        </Link>
        
        {/* Mis Reacciones con icono */}
        <Link href="/reaction" className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded-md">
          <RiEmotionLine size={24} /> {/* Aquí puedes usar otro icono de react-icons */}
          Mis Reacciones
        </Link>
        <Link href="/profile" className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded-md">
            <FiUser size={24} />
            Mi Perfil
        </Link>
      </div>


      <div className="flex flex-col items-center mt-auto space-y-2">
        <button onClick={handleLogout} className="w-full flex items-center gap-2 justify-center p-2 bg-red-500 rounded-md hover:bg-red-600">
          <FiLogOut size={24} />
          Cerrar Sesión
        </button>
      </div>

      <p className="mt-4 text-xs text-gray-400 text-center">© 2024 Todos los derechos reservados</p>
    </div>
  );
};

export default Navbar;
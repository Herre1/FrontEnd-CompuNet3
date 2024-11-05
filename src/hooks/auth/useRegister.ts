import { useCallback } from "react";
import { AuthService } from "@/app/services/auth.service";

export const useRegister = () => {
    const register = useCallback(async (username: string, email: string, password: string) => {
        const authService = new AuthService("https://proyecto-compunet-lll.onrender.com");
        await authService.register(username, email, password); // Método register en tu servicio
    }, []);

    return { register };
};
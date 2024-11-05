import { useCallback } from "react";
import { AuthService } from "@/services/auth.service";

export const useRegister = () => {
    const register = useCallback(async (username: string, email: string, password: string) => {
        const authService = new AuthService("http://localhost:4000");
        await authService.register(username, email, password); // Método register en tu servicio
    }, []);

    return { register };
};

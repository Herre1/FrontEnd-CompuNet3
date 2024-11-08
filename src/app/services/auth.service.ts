// services/authService.ts
import axios, { AxiosInstance } from 'axios';

export class AuthService {
    protected readonly axios: AxiosInstance; 

    public constructor(url: string) {
        this.axios = axios.create({
            baseURL: url, 
            headers: {
                'Content-Type': 'application/json'
            }, 
            timeout: 30000
        });
    }

    public async login(email: string, password: string): Promise<unknown> { // Cambiado a unknown
        const response = await this.axios.post('/Auth/login', { email, password });
        return response.data;
    }

    public async register(fullName: string, email: string, password: string): Promise<void> {
        await this.axios.post("/Auth/register", { fullName, email, password });
    }
    
}
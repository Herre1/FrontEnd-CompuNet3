import axios, { AxiosInstance } from 'axios';

export class AuthService {
    protected readonly axios: AxiosInstance; 

    public constructor(url: string) {
        this.axios = axios.create({
            baseURL: url, 
            headers: {
                'Content-Type': 'application/json'
            }, 
            timeout: 3000
        });
    }

    public async login(email: string, password: string): Promise<unknown> { // Cambiado a unknown
        const response = await this.axios.post('/auth/login', { email, password });
        return response.data;
    }

    public async register(username: string, email: string, password: string): Promise<void> {
        await this.axios.post("/auth/register", { username, email, password });
    }
    
}

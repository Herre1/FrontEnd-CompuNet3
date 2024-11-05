// services/authService.ts
import axios from 'axios';

const API_URL = 'https://proyecto-compunet-lll.onrender.com';

export interface RegisterData {
    username: string;
    email: string;
    password: string;
}

export interface LoginData {
    email: string;
    password: string;
}

export const registerUser = async (data: RegisterData) => {
    return await axios.post(`${API_URL}/register`, data);
};

export const loginUser = async (data: LoginData) => {
    return await axios.post(`${API_URL}/login`, data);
};
import { Api } from "../api/api";

export async function LoginRequest(email: string, senha: string) {
    try {
        const response = await Api.post('/login', { email: email, senha: senha });
        return response.data;
    } catch (error) {
        throw error;
    }
}

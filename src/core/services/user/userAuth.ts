import { LOGIN_USER } from "../../constants/constants";
import { Api } from "../api/api";

export async function LoginRequest(email: string, password: string) {
    try {
        const response = await Api.post(LOGIN_USER, { email: email, password: password });
        return response.data;
    } catch (error) {
        throw error;
    }
}

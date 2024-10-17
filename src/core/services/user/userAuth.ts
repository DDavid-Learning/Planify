import { LOGIN_USER } from "../../constants/constants";
import { Api } from "../api/api";

export async function LoginRequest(email: string, password: string) {
  try {
    const response = await Api.post(
      LOGIN_USER,
      { email, password },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Login response:", response.data);
    return response.data;
  } catch (error: any) {
    console.error(
      "Login error:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
}

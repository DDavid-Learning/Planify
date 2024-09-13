import { DETAILS_USER, REGISTER_USER } from "../../constants/constants";
import { Api } from "./api";

const registerUser = async (username: string, email: string, password: string) => {
    try {
        const response = await Api.post(REGISTER_USER, { username: username, email: email, password: password });
        return response.data;
    } catch (error) {
        throw error;
    }
}

const detailsUser = async (userId: string) => {
    try {
        const response = await Api.get(`${DETAILS_USER}${userId}`)  ;
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const userService = {
    registerUser,
    detailsUser
}
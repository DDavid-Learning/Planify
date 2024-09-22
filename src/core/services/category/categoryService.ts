import { CATEGORY, CATEGORY_ID } from "../../constants/constants";
import { Api } from "../api/api";

const registerCategory = async (name: string, userId: string) => {
    try {
        const response = await Api.post(CATEGORY, { name: name, userId: userId });
        return response.data;
    } catch (error) {
        throw error;
    }
}

const getCategory = async (id: string) => {
    try {
        const response = await Api.get(CATEGORY_ID + `${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const categoryService = {
    registerCategory,
    getCategory
}

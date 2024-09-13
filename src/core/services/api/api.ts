import axios from "axios"
import { getUserLocalStorage } from "../../utils/localStorage"


export const Api = axios.create({ baseURL: "http://localhost:8080" })


Api.interceptors.request.use(
    (config) => {
        const user = getUserLocalStorage();
        if (user && user.token) {
            config.headers.Authorization = `Bearer ${user.token}`;
        }
        return config;
    },
    (error) => {
        return console.log("erro de token");
    }
)
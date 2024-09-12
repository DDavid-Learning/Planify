import { IUser } from "../models/authContext";


export function setUserLocalStorage(user: IUser | null) {
    if (user) {
        localStorage.setItem('user', JSON.stringify(user));
    } else {
        localStorage.removeItem('user');
    }
}

export function cleanLocalStorage() {
    localStorage.clear()
}

export function getUserLocalStorage() {
    const json = localStorage.getItem('user');
    if (!json) {
        return null;
    }
    try {
        const user = JSON.parse(json);
        return user ?? null;
    } catch (error) {
        return null;
    }
}

import { createContext, useEffect, useState } from "react";
import { IAuthProvider, IContext, IUser } from "../../models/authContext";
import { getUserLocalStorage, setUserLocalStorage } from "../../utils/localStorage";
import { LoginRequest } from "../../services/user/userAuth";
import { jwtDecode } from "jwt-decode";
interface IDialogContext {
    isLogoutDialogOpen: boolean;
    openLogoutDialog: () => void;
    closeLogoutDialog: () => void;
}

const defaultDialogContext: IDialogContext = {
    isLogoutDialogOpen: false,
    openLogoutDialog: () => { },
    closeLogoutDialog: () => { }
};

interface DecodedToken {
    userId: string;
    sub: string;
}

export const AuthContext = createContext<IContext & IDialogContext>({
    ...defaultDialogContext,
    ...{} as IContext
});

export const AuthProvider: React.FC<IAuthProvider> = ({ children }) => {
    const persistUser = getUserLocalStorage();
    const [user, setUser] = useState<IUser | null>(persistUser);
    const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);

    useEffect(() => {
        const user = getUserLocalStorage();
        if (user) {
            setUser(user);
        }
    }, []);

    async function authenticate(email: string, senha: string) {
        try {
            const resp = await LoginRequest(email, senha);
            
            // Decodificar o token para obter as informações do usuário
            const decodedToken = jwtDecode<DecodedToken>(resp);
            
            // Preparar o payload com as informações decodificadas
            const payload = {
                token: resp,
                userId: decodedToken.userId,
                email: decodedToken.sub,
            };
            
            setUser(payload);
            setUserLocalStorage(payload);
            
            return resp;
        } catch (error) {
            throw error;
        }
    }
    function logout() {
        setUser(null);
        setUserLocalStorage(null);
    }

    function openLogoutDialog() {
        setIsLogoutDialogOpen(true);
    }

    function closeLogoutDialog() {
        setIsLogoutDialogOpen(false);
    }

    return (
        <AuthContext.Provider
            value={{
                ...user,
                authenticate,
                logout,
                isLogoutDialogOpen,
                openLogoutDialog,
                closeLogoutDialog
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

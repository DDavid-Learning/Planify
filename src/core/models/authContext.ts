export interface IUser {
    email?: string;
    userId?: string;
    token?: string;
}

export interface IContext extends IUser {
    authenticate : (email: string, senha: string) => Promise<void>;
    logout: () => void;
}

export interface IAuthProvider {
    children: JSX.Element;
}
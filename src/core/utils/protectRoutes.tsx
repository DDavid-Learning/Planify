import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/auth/useAuth";


export const ProtectedRoutes = () => {
    const auth = useAuth()
    const { isLogoutDialogOpen, closeLogoutDialog, logout } = useAuth();


    const handleLogout = () => {
        <Navigate to="/login" />
        logout();
        closeLogoutDialog();
    };

    if (!auth.token) {
        return <Navigate to="/login" />;
    }

    return (
        <div className='app-container'>
            <Outlet />
        </div>
    );
}


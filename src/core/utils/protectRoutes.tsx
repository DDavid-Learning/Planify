import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/auth/useAuth";
import { Box } from "@mui/material";
import Navbar from "../../app/components/navbar/navbar";


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
        <Box sx={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden" }}>
            <Navbar />
            <Box
                sx={{
                    flex: 1,
                    overflowY: "auto", // Permite o scroll vertical se necessário
                    padding: 2, // Opcional: adicionar um espaçamento
                }}
            >
                <Outlet />
            </Box>
        </Box>
    );
}


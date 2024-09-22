import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/auth/useAuth";
import { Box } from "@mui/material";
import Navbar from "../../app/components/navbar/navbar";
import theme from "../theme/theme";


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
        <Box sx={{ display: "flex", flex: 1, overflowX: "hidden", flexDirection: "column" }}>
            <Navbar />
            <Box sx={{ display: "flex", flex: 1}}>
                <Outlet />
            </Box>
        </Box>
    );
}


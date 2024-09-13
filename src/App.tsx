import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Login from "./app/views/login/login";
import Register from "./app/views/register/register";
import { AuthProvider } from "./core/context/auth/authContext";
import { ProtectedRoutes } from "./core/utils/protectRoutes";
import Home from "./app/views/home/home";


function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Register />} />
        <Route path="*" element={<Navigate to="/login" />} />
        <Route element={<ProtectedRoutes />} >
        <Route path="/home" element={<Home />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;

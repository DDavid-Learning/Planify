import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Login from "./app/views/login/login";
import Register from "./app/views/register/register";
import { AuthProvider } from "./core/context/auth/authContext";


function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Register />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;

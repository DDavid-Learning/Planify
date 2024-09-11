import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Login from "./app/views/login/login";


function App() {
  return (
    
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    
  );
}

export default App;

import './App.css'
import {BrowserRouter, Route, Routes} from "react-router";
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import {AuthProvider} from "./context/AuthContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    {/* routes for m1: Homepage, LoginPage, RegisterPage, ProfilePage */}
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App

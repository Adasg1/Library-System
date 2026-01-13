import './App.css'
import {BrowserRouter, Route, Routes} from "react-router";
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import {AuthProvider} from "./context/AuthContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import Navbar from "./components/Navbar.jsx";
import BookListPage from "./pages/BookListPage.jsx";
import BookFormPage from "./pages/BookFormPage.jsx";
import BookDetailsPage from "./pages/BookDetailsPage.jsx";
import AdminPage from "./pages/AdminPage.jsx";

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Navbar />
                <Routes>
                    {/* M1: Homepage, LoginPage, RegisterPage, ProfilePage */}
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />

                    {/* Katalog książek - dostępny dla każdego zalogowanego*/}
                    <Route path="/books" element={<ProtectedRoute><BookListPage /></ProtectedRoute>} />

                    {/* Detale nt. książki */}
                    <Route path="/books/details/:id" element={<ProtectedRoute><BookDetailsPage /></ProtectedRoute>} />

                    {/* Dodawanie książek - Admin lub Bibliotekarz*/}
                    <Route path="/books/new" element={<ProtectedRoute requiredRoles={['ADMIN', 'LIBRARIAN']}><BookFormPage /></ProtectedRoute>} />

                    {/* Edycja książek - Admin lub Bibliotekarz*/}
                    <Route path="/books/update/:id" element={<ProtectedRoute requiredRoles={['ADMIN', 'LIBRARIAN']}><BookFormPage /></ProtectedRoute>} />

                    {/* Widok profilu - dostępny dla każdego zalogowanego*/}
                    <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

                    {/* Panel Admina   */}
                    <Route path="/admin/users" element={<ProtectedRoute requiredRoles={['ADMIN']}><AdminPage /></ProtectedRoute>} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App

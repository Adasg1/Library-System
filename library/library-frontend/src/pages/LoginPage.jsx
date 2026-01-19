import React, { useState } from 'react';
import { useNavigate, Link } from "react-router";
import { useAuth } from "../context/AuthContext.jsx";
import { Login, ArrowBack } from '@mui/icons-material';

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();
    const { login } = useAuth();

    const validateEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    const validateForm = () => {
        if (!email || !password) {
            setError("Wszystkie pola są wymagane.");
            return false;
        }

        if (!validateEmail(email)) {
            setError("Wprowadź poprawny adres e-mail.");
            return false;
        }
        return true;
    };

    const handleLogin = async (e) => {
        setError("");
        e.preventDefault();

        if(!validateForm()) return;

        try{
            const result = await login(email, password);
            if (result.success) {
                navigate("/");
            } else {
                setError(result.msg || "Błąd logowania.");
            }
        } catch(err) {
            setError("Błąd połączenia z serwerem.");
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
            <div className="bg-white max-w-md w-full rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">

                <div className="bg-[#646cff] p-8 text-center text-white">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-white-20 rounded-full mb-4 backdrop-blur-sm">
                        <Login sx={{fontSize: 32}}></Login>
                    </div>
                    <h2 className="text-3xl font-bold">Witaj ponownie!</h2>
                    <p className="text-indigo-100 mt-2">Zaloguj się, aby zarządzać biblioteką.</p>
                </div>

                <div className="p-8">
                    {error && (
                        <div className="mb-6 bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm font-bold border border-red-100 flex items-center">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-600 uppercase tracking-wide">Adres Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full border-2 border-gray-100 p-3 rounded-xl focus:border-[#646cff] focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all text-gray-700 font-medium"
                                placeholder="jan.kowalski@example.com"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-600 uppercase tracking-wide">Hasło</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full border-2 border-gray-100 p-3 rounded-xl focus:border-[#646cff] focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all text-gray-700 font-medium"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-[#646cff] hover:bg-[#535bf2] text-white font-bold py-3.5 rounded-xl shadow-lg shadow-indigo-200 transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed mt-4"
                        >
                            Zaloguj się
                        </button>
                    </form>

                    <div className="mt-8 flex items-center justify-between text-sm border-t border-gray-100 pt-6">
                        <Link to="/" className="flex items-center gap-1 text-gray-500 hover:text-gray-900 transition-colors font-medium">
                            <ArrowBack fontSize="inherit" /> Strona główna
                        </Link>
                        <span className="text-gray-400">|</span>
                        <Link to="/register" className="text-[#646cff] hover:text-[#535bf2] font-bold">
                            Nie masz konta? Zarejestruj się
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
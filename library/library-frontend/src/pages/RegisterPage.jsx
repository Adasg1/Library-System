import React, {useState} from 'react';
import {useNavigate, Link} from "react-router";
import {useAuth} from "../context/AuthContext.jsx";
import {PersonAdd, ArrowBack, Login} from '@mui/icons-material';

const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
    });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    // pobieram funkcję register z Contextu
    const {register} = useAuth();

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    const handleRegister = async (e) => {
        setError("");
        e.preventDefault();

        // walidacja uzupełnienia wszystkich pól
        if (!formData.email || !formData.password || !formData.firstName || !formData.lastName) {
            setError("Wszystkie pola są wymagane.");
            return;
        }

        if (!validateEmail(formData.email)) {
            setError("Wprowadź poprawny adres e-mail.");
            return;
        }

        if (formData.password.length < 8) {
            setError("Hasło musi mieć co najmniej 8 znaków.");
            return;
        }

        try {
            const result = await register(formData);

            if (result.success) {
                setError("");
                navigate("/");
            } else {
                setError(result.error || "Błąd rejestracji");
            }
        } catch (err) {
            setError("Rejestracja się nie powiodła. Spróbuj ponownie.");
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
            <div className="bg-white max-w-md w-full rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">

                {/* Header */}
                <div className="bg-[#646cff] p-8 text-center text-white">
                    <div
                        className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4 backdrop-blur-sm">
                        <PersonAdd sx={{fontSize: 32}}/>
                    </div>
                    <h2 className="text-3xl font-bold">Witaj!</h2>
                    <p className="text-indigo-100 mt-2">Zarejestruj się, aby zarządzać biblioteką.</p>
                </div>

                <div className="p-8">
                    {error && (
                        <div
                            className="mb-6 bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm font-bold border border-red-100 flex items-center">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleRegister} className="space-y-4">

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-600 uppercase tracking-wide">Imię</label>
                            <input
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                className="w-full border-2 border-gray-100 p-3 rounded-xl focus:border-[#646cff] focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all text-gray-700 font-medium"
                                placeholder="Jan"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-600 uppercase tracking-wide">Nazwisko</label>
                            <input
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                className="w-full border-2 border-gray-100 p-3 rounded-xl focus:border-[#646cff] focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all text-gray-700 font-medium"
                                placeholder="Kowalski"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-600 uppercase tracking-wide">Adres
                                Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full border-2 border-gray-100 p-3 rounded-xl focus:border-[#646cff] focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all text-gray-700 font-medium"
                                placeholder="jan@kowalski.pl"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-600 uppercase tracking-wide">Hasło</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full border-2 border-gray-100 p-3 rounded-xl focus:border-[#646cff] focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all text-gray-700 font-medium"
                                placeholder="Minimum 8 znaków"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-[#646cff] hover:bg-[#535bf2] text-white font-bold py-3.5 rounded-xl shadow-lg shadow-indigo-200 transition-all transform active:scale-[0.98] mt-4"
                        >
                            Zarejestruj się
                        </button>
                    </form>

                    <div className="mt-8 flex items-center justify-between text-sm border-t border-gray-100 pt-6">
                        <Link to="/"
                              className="flex items-center gap-1 text-gray-500 hover:text-gray-900 transition-colors font-medium">
                            <ArrowBack fontSize="inherit"/> Strona główna
                        </Link>
                        <span className="text-gray-400">|</span>
                        <Link to="/login" className="text-[#646cff] hover:text-[#535bf2] font-bold">
                            Masz już konto? Zaloguj się
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
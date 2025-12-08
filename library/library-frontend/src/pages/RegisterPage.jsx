import React, {useState} from 'react';
import {useNavigate} from "react-router";
import {useAuth} from "../context/AuthContext.jsx";
import {Link} from "react-router";

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
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async () => {
        // walidacja uzupełnienia wszystkich pól
        if(!formData.email || !formData.password || !formData.firstName || !formData.lastName) {
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

            if(result.success) {
                setError("");
                navigate("/");
            } else {
                setError(result.error || "Błąd rejestracji");
            }
        } catch (err){
            setError("Rejestracja się nie powiodła. Spróbuj ponownie.");
            console.error(err);
        }
    };

    return (
        <div>
            <h1>Rejestracja</h1>
            <input name="firstName" type="text" placeholder="Imię" value={formData.firstName} onChange={handleChange}/>
            <input name="lastName" type="text" placeholder="Nazwisko" value={formData.lastName} onChange={handleChange}/>
            <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange}/>
            <input name="password" type="password" placeholder="Hasło" value={formData.password} onChange={handleChange}/>
            <h2>{error}</h2>
            <div style={{display: "flex", gap: "20px", justifyContent: "center", marginTop: "20px"}}>
                <button onClick={handleRegister}>Zarejestruj się</button>
                <Link to="/">
                    <button>Powrót</button>
                </Link>
            </div>
        </div>
    );
};

export default RegisterPage;
import React, {useState} from 'react';
import {useNavigate} from "react-router";
import {authService} from "../services/authService.js";
import {Link} from "react-router-dom";

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
    });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async () => {
        if(!formData.email || !formData.password || !formData.firstName || !formData.lastName) {
            setError("Wszystkie pola są wymagane.");
            return;
        }
        try {
            await authService.register(formData);
            navigate("/login");
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
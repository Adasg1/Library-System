import React, {useState} from 'react';
import {useNavigate} from "react-router";
import {useAuth} from "../context/AuthContext.jsx";
import {Link} from "react-router";

const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    // pobieram funkcję login z Contextu
    const {login} = useAuth();

    const handleLogin = async () => {
        // walidacja uzupełnienia wszystkich pól
        if( !email || !password ) {
            setError("Wszystkie pola są wymagane.");
            return;
        }

        if (!validateEmail(email)) {
            setError("Wprowadź poprawny adres e-mail.");
            return;
        }

        try{
            const result = await login(email, password);

            if (result.success) {
                setError("");
                navigate("/");
            } else {
                setError(result.error || "Błąd logowania");
            }
        } catch(err) {
            console.error(err);
            setError("Błąd połączenia")
        }

    }

    return (
        <div>
            <h1>Logowanie</h1>
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}  />
            <h2>{error}</h2>
            <div style={{display: "flex", gap: "20px", justifyContent: "center", marginTop: "20px"}}>
                <button onClick={handleLogin}>Login</button>
                <Link to="/">
                    <button >Powrót</button>
                </Link>
            </div>
        </div>
    );
};

export default LoginPage;
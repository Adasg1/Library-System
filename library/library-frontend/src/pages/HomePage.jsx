import React, {use} from 'react';
import {Link} from 'react-router';
import {useAuth} from "../context/AuthContext.jsx";

const HomePage = () => {
    const {user, logout} = useAuth();

    return (
        <div>
            <h1>Biblioteka</h1>
            <p>Witamy w systemie do obsługi biblioteki.</p>

            {user ? (
                // widok dla zalogowanego użytkownika
                <div>
                    <h2>Witaj, {user.firstName}.</h2>
                    <button onClick={logout}>Wyloguj się</button>
                </div>
            ) : (
                // widok dla niezalogowanego użytkownika
                <div style={{display: "flex", gap: "20px", justifyContent: "center", marginTop: "20px"}}>
                    <Link to="/login">
                        <button>Zaloguj się</button>
                    </Link>
                    <Link to="/register">
                        <button>Zarejestruj się</button>
                    </Link>
                </div>
            )}
        </div>
    );
};

export default HomePage;
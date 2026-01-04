import React from 'react';
import {useAuth} from "../context/AuthContext.jsx";
import {Link} from "react-router";

const ProfilePage = () => {
    const { user } = useAuth();

    return (
        <div>
            <h1>Strona Profilu</h1>
            <p>Witaj na swoim profilu, {user.firstName}.</p>
            <p>Tę stronę widzą tylko zalogowani użytkownicy.</p>
            <div className="profile-container">
                <p>Dane użytkownika: </p>
                <p>Rola: {user.role}</p>
                <p>Imię: {user.firstName}</p>
                <p>Nazwisko: {user.lastName}</p>
                <p>Adres e-mail: {user.email}</p>
            </div>
            <Link to="/">
                <button>Powrót</button>
            </Link>
        </div>
    );
};

export default ProfilePage;
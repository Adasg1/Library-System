import React, {use} from 'react';
import {Link} from 'react-router';
import {useAuth} from "../context/AuthContext.jsx";

const HomePage = () => {
    const {user, logout} = useAuth();

    const isStaff = user?.role === 'ADMIN' || user?.role === 'LIBRARIAN';

    return (
        <div className="home-container">
            <header className="home-header">
                <h2>Witamy w systemie do obsługi biblioteki.</h2>
            </header>

            {user ? (
                // widok dla zalogowanego użytkownika
                <div className="dashboard">
                    <h2>Witaj, {user.firstName}.</h2>
                    <div className="tiles-grid">
                        {/* Kafelek 1 - katalog książek */}
                        <Link to="/books" className="tile">
                            <h3>Przeglądaj katalog</h3>
                            <p>Zobacz dostępne tytuły i wypożycz coś dla siebie.</p>
                        </Link>

                        {/* Kafelek 2 - profil */}
                        <Link to="/profile" className="tile">
                            <h3>Mój profil</h3>
                            <p>Sprawdź swoje dane.</p>
                        </Link>

                        {/* Kafelki ADMINA i Bibliotekarza */}
                        {isStaff && (
                            <>
                                <Link to="/books/new" className="admin-tile">
                                    <h3>Dodaj Książkę</h3>
                                    <p>Wprowadź nową pozycję do systemu.</p>
                                </Link>

                                {/* Przycisk widoczny tylko dla Admina */}
                                {user?.role === 'ADMIN' && (
                                    <Link to="/admin/users" className="admin-tile" style={{ backgroundColor: '#d32f2f' }}>
                                        <h3>Użytkownicy</h3>
                                        <p>Zarządzaj rolami i kontami.</p>
                                    </Link>
                                )}
                            </>
                        )}
                    </div>
                </div>
            ) : (
                // Widok dla niezalogowanego użytkownika
                <div className="guest-section">
                    <p>Zaloguj się, aby przeglądać katalog i wypożyczać książki.</p>
                </div>
            )}
        </div>
    );
};

export default HomePage;
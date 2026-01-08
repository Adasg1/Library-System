import React, { useEffect, useState } from 'react';
import {useAuth} from "../context/AuthContext.jsx";
import {Link} from "react-router";
import {loanService} from "../services/loanService.js";
import {reservationService} from "../services/reservationService.js";

const ProfilePage = () => {
    const { user } = useAuth();
    const [loans, setLoans] = useState([]);
    const [reservations, setReservations] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            if (user) {
                try {
                    const data = await loanService.getMyLoans();
                    setLoans(data);
                } catch (error) {
                    console.error("Błąd pobierania wypożyczeń:", error);
                }

                try {
                    const reservationsData = await reservationService.getMyReservations();
                    setReservations(reservationsData);
                } catch (error) {
                    console.error("Błąd pobierania rezerwacji:", error);
                }
            }
        };
        fetchData();
    }, [user]);

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

            <div className="loans-container" style={{ marginTop: '30px' }}>
                <h2>Twoje wypożyczenia</h2>
                {loans.length === 0 ? (
                    <p>Brak wypożyczeń.</p>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                        <tr style={{ borderBottom: '1px solid #ccc' }}>
                            <th style={{ textAlign: 'left', padding: '10px' }}>Tytuł</th>
                            <th style={{ textAlign: 'left', padding: '10px' }}>Data wypożyczenia</th>
                            <th style={{ textAlign: 'left', padding: '10px' }}>Termin zwrotu</th>
                            <th style={{ textAlign: 'left', padding: '10px' }}>Status</th>
                        </tr>
                        </thead>
                        <tbody>
                        {loans.map(loan => (
                            <tr key={loan.id} style={{ borderBottom: '1px solid #eee' }}>
                                <td style={{ padding: '10px' }}>{loan.bookTitle || `Książka #${loan.bookCopyId}`}</td>
                                <td style={{ padding: '10px' }}>{loan.rentalDate}</td>
                                <td style={{ padding: '10px' }}>{loan.dueDate}</td>
                                <td style={{ padding: '10px' }}>{loan.status}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>

            <div className="reservations-container" style={{ marginTop: '30px', marginBottom: '30px' }}>
                <h2>Twoje rezerwacje</h2>
                {reservations.length === 0 ? (
                    <p>Brak rezerwacji.</p>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                        <tr style={{ borderBottom: '1px solid #ccc' }}>
                            <th style={{ textAlign: 'left', padding: '10px' }}>Książka</th>
                            <th style={{ textAlign: 'left', padding: '10px' }}>Data rezerwacji</th>
                            <th style={{ textAlign: 'left', padding: '10px' }}>Status</th>
                            <th style={{ textAlign: 'left', padding: '10px' }}>Akcje</th>
                        </tr>
                        </thead>
                        <tbody>
                        {reservations.map(res => (
                            <tr key={res.reservationId} style={{ borderBottom: '1px solid #eee' }}>
                                <td style={{ padding: '10px' }}>{res.bookTitle}</td>

                                <td style={{ padding: '10px' }}>
                                    {new Date(res.reservationDate).toLocaleDateString('pl-PL', {
                                        day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
                                    })}
                                </td>

                                <td style={{ padding: '10px' }}>{res.status}</td>

                                <td style={{ padding: '10px' }}>
                                    {['WAITING', 'READY'].includes(res.status) && (
                                        <button
                                            onClick={async () => {
                                                if(window.confirm('Anulować rezerwację?')) {
                                                    try {
                                                        await reservationService.cancelReservation(res.reservationId);
                                                        const updated = await reservationService.getMyReservations();
                                                        setReservations(updated);
                                                    } catch(e) {
                                                        alert('Błąd anulowania rezerwacji');
                                                    }
                                                }
                                            }}
                                            style={{ backgroundColor: '#e53935', fontSize: '0.8em', padding: '5px 10px' }}
                                        >
                                            Anuluj
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>

            <Link to="/">
                <button>Powrót</button>
            </Link>
        </div>
    );
};

export default ProfilePage;
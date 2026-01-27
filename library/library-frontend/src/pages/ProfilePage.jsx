import React, { useEffect, useState } from 'react';
import { useAuth } from "../context/AuthContext.jsx";
import { Link } from "react-router";
import { loanService } from "../services/loanService.js";
import { reservationService } from "../services/reservationService.js";
import {
    AccountCircle,
    Email,
    Badge,
    AssignmentInd,
    History,
    EventNote,
    ArrowBack
} from '@mui/icons-material';
import UserOpinions from "../components/UserOpinions.jsx";

const ProfilePage = () => {
    const { user } = useAuth();
    const [loans, setLoans] = useState([]);
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);

    const handleProlong = async (loanId) => {
        if (window.confirm('Czy chcesz przedłużyć termin zwrotu o 30 dni?')) {
            try {
                await loanService.prolongLoan(loanId);
                const updatedLoans = await loanService.getMyLoans();
                setLoans(updatedLoans);
                alert('Termin został pomyślnie przedłużony.');
            } catch (error) {
                const message = error.response?.data?.message || "Nie można przedłużyć tego wypożyczenia.";
                alert(message);
            }
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            if (user) {
                try {
                    const [loansData, reservationsData] = await Promise.all([
                        loanService.getMyLoans(),
                        reservationService.getMyReservations()
                    ]);
                    setLoans(loansData);
                    setReservations(reservationsData);
                } catch (error) {
                    console.error("Błąd pobierania danych:", error);
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchData();
    }, [user]);

    if (!user) return null;

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-12 text-gray-900">
            <div className="max-w-6xl mx-auto space-y-8">

                {/* Nagłówek i przycisk powrotu */}
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-extrabold tracking-tight">Mój Profil</h1>
                    <Link to="/">
                        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-all font-medium shadow-sm">
                            <ArrowBack fontSize="small" /> Powrót
                        </button>
                    </Link>
                </div>

                {/* Sekcja 1: Dane użytkownika */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="bg-[#646cff] p-6 text-white flex items-center gap-4">
                        <div className="bg-white/20 p-3 rounded-2xl">
                            <AccountCircle sx={{ fontSize: 40 }} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">{user.firstName} {user.lastName}</h2>
                            <p className="text-indigo-100 text-sm opacity-90">Zalogowany jako: {user.role}</p>
                        </div>
                    </div>

                    <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="space-y-1">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                <Email sx={{ fontSize: 16 }} /> Adres e-mail
                            </p>
                            <p className="text-lg font-medium text-gray-800">{user.email}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                <Badge sx={{ fontSize: 16 }} /> Imię i Nazwisko
                            </p>
                            <p className="text-lg font-medium text-gray-800">{user.firstName} {user.lastName}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                <AssignmentInd sx={{ fontSize: 16 }} /> Twoja Rola
                            </p>
                            <span className="inline-block px-3 py-1 bg-indigo-50 text-[#646cff] rounded-lg font-bold text-sm">
                                {user.role}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* Sekcja 2: Wypożyczenia */}
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                                <History />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900">Twoje wypożyczenia</h2>
                        </div>

                        {loans.length === 0 ? (
                            <div className="py-10 text-center border-2 border-dashed border-gray-100 rounded-2xl text-gray-400">
                                Brak aktywnych wypożyczeń.
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                    <tr className="border-b border-gray-100">
                                        <th className="pb-4 text-xs font-bold text-gray-400 uppercase">Tytuł</th>
                                        <th className="pb-4 text-xs font-bold text-gray-400 uppercase">Termin</th>
                                        <th className="pb-4 text-xs font-bold text-gray-400 uppercase">Status</th>
                                        <th className="pb-4 text-xs font-bold text-gray-400 uppercase text-right">Akcje</th>
                                    </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                    {loans.map(loan => (
                                        <tr key={loan.loanId} className="group hover:bg-gray-50 transition-colors">
                                            <td className="py-4">
                                                <div className="font-medium text-gray-900">{loan.bookTitle || `Książka #${loan.bookCopyId}`}</div>
                                                {/* Opcjonalnie: Licznik prolongat z Twojego modelu Loan.java */}
                                                {loan.timesProlonged > 0 && (
                                                    <div className="text-[10px] text-indigo-400 font-bold uppercase">
                                                        Przedłużono: {loan.timesProlonged} raz(y)
                                                    </div>
                                                )}
                                            </td>
                                            <td className="py-4 text-sm text-gray-500">
                                                {new Date(loan.dueDate).toLocaleDateString()}
                                            </td>
                                            <td className="py-4">
                                                <span className={`px-2 py-1 text-xs font-bold rounded-md uppercase ${
                                                    loan.status === 'OVERDUE' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
                                                }`}>
                                                    {loan.status}
                                                </span>
                                            </td>
                                            <td className="py-4 text-right">
                                                {/* Przycisk prolongaty - widoczny tylko gdy status jest ACTIVE i nie ma przeterminowania */}
                                                {loan.status === 'ACTIVE' && (
                                                    <button
                                                        onClick={() => handleProlong(loan.loanId)}
                                                        className="px-3 py-1 bg-[#646cff] text-white hover:bg-[#535bf2] rounded-lg text-xs font-bold transition-colors shadow-sm"
                                                    >
                                                        Prolonguj
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {/* Sekcja 3: Rezerwacje */}
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                                <EventNote />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900">Twoje rezerwacje</h2>
                        </div>

                        {reservations.length === 0 ? (
                            <div className="py-10 text-center border-2 border-dashed border-gray-100 rounded-2xl text-gray-400">
                                Brak aktywnych rezerwacji.
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                    <tr className="border-b border-gray-100">
                                        <th className="pb-4 text-xs font-bold text-gray-400 uppercase">Tytuł</th>
                                        <th className="pb-4 text-xs font-bold text-gray-400 uppercase">Status</th>
                                        <th className="pb-4 text-xs font-bold text-gray-400 uppercase text-right">Akcje</th>
                                    </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                    {reservations.map(res => (
                                        <tr key={res.reservationId} className="hover:bg-gray-50 transition-colors">
                                            <td className="py-4 font-medium text-gray-900">{res.bookTitle}</td>
                                            <td className="py-4">
                                                    <span className={`px-2 py-1 text-xs font-bold rounded-md uppercase ${
                                                        res.status === 'READY' ? 'bg-blue-50 text-blue-700' : 'bg-amber-50 text-amber-700'
                                                    }`}>
                                                        {res.status}
                                                    </span>
                                            </td>
                                            <td className="py-4 text-right">
                                                {['WAITING', 'READY'].includes(res.status) && (
                                                    <button
                                                        onClick={async () => {
                                                            if(window.confirm('Czy na pewno chcesz anulować tę rezerwację?')) {
                                                                try {
                                                                    await reservationService.cancelReservation(res.reservationId);
                                                                    const updated = await reservationService.getMyReservations();
                                                                    setReservations(updated);
                                                                } catch(e) { alert('Błąd anulowania'); }
                                                            }
                                                        }}
                                                        className="px-3 py-1 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-xs font-bold transition-colors"
                                                    >
                                                        Anuluj
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                    <div className="mt-8">
                        <UserOpinions userId={user.id} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
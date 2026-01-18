import React, { useEffect, useState } from 'react';
import { loanService } from "../services/loanService";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const AdminLoansPage = () => {
    const [loans, setLoans] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLoans();
    }, []);

    const fetchLoans = async () => {
        try {
            const data = await loanService.getAllActiveLoans();
            setLoans(data);
        } catch (error) {
            console.error("Błąd pobierania wypożyczeń", error);
            toast.error("Nie udało się pobrać listy wypożyczeń.");
        } finally {
            setLoading(false);
        }
    };

    const handleReturnBook = async (loanId) => {
        if (window.confirm("Czy na pewno chcesz zwrócić tę książkę?")) {
            try {
                await loanService.returnBook(loanId);
                toast.success("Książka zwrócona pomyślnie!");
                fetchLoans();
            } catch (error) {
                toast.error("Błąd podczas zwrotu książki.");
            }
        }
    };

    const isOverdue = (dateString) => {
        const returnDate = new Date(dateString);
        const today = new Date();
        return returnDate < today;
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-12">
            <ToastContainer />
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">Panel Wypożyczeń (Aktywne)</h1>

                {loading ? (
                    <div className="text-center">Ładowanie...</div>
                ) : loans.length === 0 ? (
                    <div className="bg-white p-8 rounded-lg shadow text-center text-gray-500">
                        Brak aktywnych wypożyczeń. Wszystkie książki są w bibliotece! 📚
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Książka</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Użytkownik</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Max Data Zwrotu</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Akcja</th>
                                </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                {loans.map((loan) => (
                                    <tr key={loan.loanId} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">#{loan.loanId}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {loan.bookTitle}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            <div>{loan.userName}</div>
                                            <div className="text-xs text-gray-400">{loan.userEmail}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <span className={`px-2 py-1 rounded-full font-medium ${
                                                isOverdue(loan.dueDate)
                                                    ? 'bg-red-100 text-red-700'
                                                    : 'bg-green-100 text-green-700'
                                            }`}>
                                                {new Date(loan.dueDate).toLocaleDateString()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <button
                                                onClick={() => handleReturnBook(loan.loanId)}
                                                className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 px-3 py-1 rounded-md hover:bg-indigo-100 transition-colors"
                                            >
                                                Zwróć
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminLoansPage;
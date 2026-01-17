import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router';
import { bookService } from "../services/bookService.js";
import { loanService } from "../services/loanService.js";
import { bookCopyService } from "../services/bookCopyService.js";
import { userService } from "../services/userService.js";
import { reservationService } from "../services/reservationService.js";
import { useAuth } from "../context/AuthContext.jsx";
import { ArrowBack, Edit, Delete, AddCircleOutline, MenuBook, BookmarkBorder, Settings, Close } from '@mui/icons-material';
import { toast } from "react-toastify";

const BookDetailsPage = () => {
    const { id } = useParams();
    const { user } = useAuth();

    const [book, setBook] = useState(null);
    const [copies, setCopies] = useState([]);
    const [imgError, setImgError] = useState(false);
    const [users, setUsers] = useState([]);

    const [showRentModal, setShowRentModal] = useState(false);
    const [showManageModal, setShowManageModal] = useState(false);

    const [selectedCopyForRent, setSelectedCopyForRent] = useState(null);
    const [selectedUserId, setSelectedUserId] = useState("");

    const canEdit = user?.role === 'ADMIN' || user?.role === 'LIBRARIAN';

    useEffect(() => {
        const loadBookDetails = async () => {
            try {
                const data = await bookService.getFullBookById(id);
                setBook(data);
                loadCopies(data.bookId);
            } catch (error) {
                console.error("Błąd pobierania szczegółów.", error);
                toast.error("Nie udało się pobrać szczegółów książki.");
            }
        };
        loadBookDetails();
    }, [id]);

    const loadCopies = async (bookId) => {
        try{
            const copiesData = await bookCopyService.getCopiesByBookId(bookId);
            setCopies(copiesData);
        } catch (error) {
            console.error("Błąd pobierania kopii.", error);
        }
    };

    const openRentModal = async (copyId) => {
        setSelectedCopyForRent(copyId);
        setShowRentModal(true);
        setSelectedUserId("");
        if (users.length === 0){
            try{
                const usersData = await userService.getUsers();
                setUsers(usersData);
            } catch (error) {
                toast.error("Nie udało się pobrać listy użytkowników");
            }
        }
    };

    const handleRentSubmit = async () => {
        if (!selectedUserId) {
            toast.warn("Wybierz użytkownika z listy!");
            return;
        }
        try{
            await loanService.rentBook(selectedUserId, selectedCopyForRent);
            toast.success(`Sukces! Wypożyczono egzemplarz dla użytkownika ID: ${selectedUserId}`);
            setShowRentModal(false);
            loadCopies(book.bookId);
        } catch (error) {
            toast.error("Błąd wypożyczania. Sprawdź czy użytkownik nie ma blokad.");
            setShowRentModal(false);
        }
    };

    const handleReserve = async () => {
        if (!user){
            toast.warn("Musisz być zalogowany, aby zarezerwować.");
            return;
        }
        try {
            await reservationService.createReservation({
                bookId: book.bookId
            });
            toast.success("Sukces! Zarezerwowano książkę.");
        } catch (error) {
            console.error(error);
            toast.error("Nie udało się zarezerwować książki (być może już ją rezerwujesz).");
        }
    }

    // Obsługa dodawania nowej kopii
    const handleAddCopy = async () => {
        if (!book) return;
        try {
            await bookCopyService.addCopy(book.bookId, "AVAILABLE");
            toast.success("Dodano nowy egzemplarz!");
            loadCopies(book.bookId);
        } catch (error) {
            toast.error("Błąd podczas dodawania egzemplarza.");
        }
    };

    const handleDeleteCopy = async (copyId) => {
        if(!window.confirm("Czy na pewno usunąć ten egzemplarz?")) return;
        try {
            await bookCopyService.deleteCopy(copyId);
            toast.info("Usunięto egzemplarz.");
            loadCopies(book.bookId);
        } catch (error) {
            toast.error("Nie można usunąć egzemplarza (być może jest wypożyczony).");
        }
    };

    if (!book){
        return <div className="p-8 text-center text-gray-500">Ładowanie szczegółów...</div>;
    }

    const availableCopiesCount = copies.filter(c => c.status === 'AVAILABLE').length;

    const coverUrl = book.isbn
        ? `https://covers.openlibrary.org/b/isbn/${book.isbn}-L.jpg?default=false`
        : null;

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-12 relative">

            {/* --- MODAL WYPOŻYCZANIA --- */}
            {showRentModal && (
                <div className="fixed inset-0 bg-gray-50 bg-opacity-60 flex justify-center items-center z-[60] p-4">
                    <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md border-gray-100 relative">
                        <h3 className="text-xl font-bold mb-4 text-gray-800">Wypożycz egzemplarz #{selectedCopyForRent}</h3>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Wybierz czytelnika:</label>
                        <select
                            className="w-full border border-gray-300 rounded-lg p-2.5 mb-6 focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                            value={selectedUserId}
                            onChange={(e) => setSelectedUserId(e.target.value)}
                        >
                            <option value="">-- Wybierz z listy --</option>
                            {users.map((u) => (
                                <option key={u.id || u.userId} value={u.id || u.userId}>
                                    {u.email} ({u.firstName ? `${u.firstName} ${u.lastName}` : u.username})
                                </option>
                            ))}
                        </select>
                        <div className="flex justify-end gap-3">
                            <button onClick={() => setShowRentModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors">Anuluj</button>
                            <button onClick={handleRentSubmit} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-sm">Zatwierdź</button>
                        </div>
                    </div>
                </div>
            )}

            {/* --- ZARZĄDZANIE EGZEMPLARZAMI --- */}
            {showManageModal && (
                <div className="fixed inset-0 bg-gray-50 bg-opacity-50 flex justify-center items-center z-40 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col border border-gray-200">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-2xl">
                            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                <Settings className="text-gray-500" />
                                Zarządzanie Egzemplarzami
                            </h3>
                            <button
                                onClick={() => setShowManageModal(false)}
                                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-full transition-colors"
                            >
                                <Close />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto">
                            <div className="flex justify-between items-center mb-6">
                                <div className="text-sm text-gray-500">
                                    Łącznie egzemplarzy: <span className="font-bold text-gray-800">{copies.length}</span>
                                </div>
                                <button
                                    onClick={handleAddCopy}
                                    className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-bold rounded-lg transition-colors shadow-sm"
                                >
                                    <AddCircleOutline fontSize="small" /> Dodaj Egzemplarz
                                </button>
                            </div>

                            {copies.length === 0 ? (
                                <div className="p-12 text-center text-gray-400 border-dashed border-2 border-gray-100 rounded-xl">
                                    Brak egzemplarzy w systemie.
                                </div>
                            ) : (
                                <div className="overflow-x-auto border border-gray-200 rounded-xl">
                                    <table className="w-full text-left">
                                        <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">ID</th>
                                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Akcje</th>
                                        </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100 bg-white">
                                        {copies.map((copy) => (
                                            <tr key={copy.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 font-medium text-gray-700">
                                                    #{copy.id}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                                                        copy.status === 'AVAILABLE'
                                                            ? 'bg-green-50 text-green-700 border-green-100'
                                                            : copy.status === 'LOANED'
                                                                ? 'bg-red-50 text-red-700 border-red-100'
                                                                : 'bg-yellow-50 text-yellow-700 border-yellow-100'
                                                    }`}>
                                                        {copy.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        {(copy.status === 'AVAILABLE' || copy.status === 'RESERVED') && (
                                                            <button
                                                                onClick={() => openRentModal(copy.id)}
                                                                className="px-3 py-1 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-md text-xs font-bold transition-colors border border-blue-100"
                                                            >
                                                                Wypożycz
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={() => handleDeleteCopy(copy.id)}
                                                            className={`px-2 py-1 rounded-md text-xs font-bold transition-colors ${
                                                                copy.status !== 'AVAILABLE'
                                                                    ? 'text-gray-300 cursor-not-allowed'
                                                                    : 'text-red-600 hover:bg-red-50'
                                                            }`}
                                                            disabled={copy.status !== 'AVAILABLE'}
                                                        >
                                                            <Delete fontSize="small" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <div className="max-w-6xl mx-auto">
                {/* --- HEADER --- */}
                <div className="flex justify-between items-center mb-6">
                    <Link to="/books" className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition-colors font-medium">
                        <ArrowBack fontSize="small" /> Wróć do listy
                    </Link>

                    {canEdit && (
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowManageModal(true)}
                                className="flex items-center gap-2 text-gray-700 hover:text-gray-900 font-bold bg-white px-4 py-2 rounded-lg transition-colors border border-gray-200 hover:border-gray-300 shadow-sm"
                            >
                                <Settings fontSize="small" /> Zarządzaj egzemplarzami
                            </button>

                            <Link to={`/books/update/${book.bookId}`} className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-bold bg-indigo-50 px-4 py-2 rounded-lg transition-colors border border-indigo-100">
                                <Edit fontSize="small" /> Edytuj dane
                            </Link>
                        </div>
                    )}
                </div>

                {/* --- GŁÓWNA KARTA KSIĄŻKI --- */}
                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden mb-8">
                    <div className="p-8">
                        <div className="flex flex-col md:flex-row gap-10">

                            {/* LEWA KOLUMNA: Okładka + Metadane techniczne */}
                            <div className="md:w-1/3 lg:w-1/4 flex flex-col gap-6">

                                <div className="w-full bg-gray-100 rounded-xl overflow-hidden border border-gray-200 shadow-sm flex items-center justify-center min-h-[340px]">
                                    {!imgError && coverUrl ? (
                                        <img
                                            src={coverUrl}
                                            alt={`Okładka ${book.title}`}
                                            className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500"
                                            onError={() => setImgError(true)}
                                        />
                                    ) : (
                                        <div className="text-center p-6 text-gray-400">
                                            <MenuBook style={{ fontSize: 64, marginBottom: '10px' }} />
                                            <p className="text-sm font-medium">Brak okładki</p>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-3 bg-gray-50 p-4 rounded-lg border border-gray-100 text-sm">
                                    <div className="flex justify-between border-b border-gray-200 pb-2">
                                        <span className="text-gray-500">ISBN</span>
                                        <span className="font-semibold text-gray-800">{book.isbn}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-gray-200 pb-2">
                                        <span className="text-gray-500">Rok</span>
                                        <span className="font-semibold text-gray-800">{book.publishYear}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-gray-200 pb-2">
                                        <span className="text-gray-500">Wydawnictwo</span>
                                        <span className="font-semibold text-gray-800 text-right">{book.publisher}</span>
                                    </div>
                                    <div className="pt-2">
                                        <p className="text-gray-500 mb-2">Kategorie:</p>
                                        <div className="flex flex-wrap gap-2">
                                            {book.categoryNames?.map((cat, index) => (
                                                <span key={index} className="px-2 py-1 bg-white text-gray-600 text-xs font-medium rounded border border-gray-200">
                                                    {cat}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* PRAWA KOLUMNA: Tytuł, Autor, Akcje, Opis */}
                            <div className="flex-1 flex flex-col">

                                <div className="mb-6">
                                    <h1 className="text-4xl font-extrabold text-gray-900 leading-tight mb-2">
                                        {book.title}
                                    </h1>
                                    <p className="text-xl text-gray-500 font-medium">
                                        {book.author}
                                    </p>
                                </div>

                                <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                                    <div>
                                        <p className="text-blue-900 font-medium text-sm uppercase tracking-wide mb-1">Dostępność w bibliotece</p>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-blue-800">Ilość dostępnych egzemplarzy: </span>
                                            <span className={`text-3xl font-bold ${availableCopiesCount > 0 ? 'text-blue-700' : 'text-gray-400'}`}>
                                                {availableCopiesCount}
                                            </span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleReserve}
                                        className="flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
                                    >
                                        <BookmarkBorder />
                                        Zarezerwuj
                                    </button>
                                </div>

                                <div className="prose max-w-none text-gray-700">
                                    <h3 className="text-lg font-bold text-gray-900 mb-3 border-b pb-2">Opis książki</h3>
                                    <p className="leading-relaxed whitespace-pre-line">
                                        {book.description || "Brak opisu dla tej pozycji."}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default BookDetailsPage;
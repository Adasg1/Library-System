import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router';
import { bookService } from "../services/bookService.js";
import { loanService } from "../services/loanService.js";
import { bookCopyService } from "../services/bookCopyService.js";
import { userService } from "../services/userService.js";
import { reservationService } from "../services/reservationService.js";
import { useAuth } from "../context/AuthContext.jsx";
import { ArrowBack, Edit, WarningAmber, Delete, AddCircleOutline } from '@mui/icons-material';
import { toast } from "react-toastify";

const BookDetailsPage = () => {
    const { id } = useParams();
    const { user } = useAuth();

    const [book, setBook] = useState(null);
    const [copies, setCopies] = useState([]);

    const [imgError, setImgError] = useState(false);

    const [users, setUsers] = useState([]);
    const [showRentModal, setShowRentModal] = useState(false);
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

    // Pobieranie kopii książki
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

        // pobieram listę użytkowników
        // jednak tu wybieranie użytkownika przez wyszukiwanie po nazwisku będzie lepsze w przypadku np. 5000 użytkowników
        // do poprawy
        if (users.length === 0){
            try{
                const usersData = await userService.getUsers();
                setUsers(usersData);
            } catch (error) {
                console.error("Błąd pobierania użytkowników.", error);
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
            console.error(error);
            toast.error("Błąd wypożyczania. Sprawdź czy użytkownik nie ma blokad.");            setShowRentModal(false);
        }
    };

    // Obsługa rezerwacji książki
    const handleReserve = async () => {
        if (!user){
            toast.warn("Musisz być zalogowany, aby zarezerwować.");
            return;
        }
        try {
            await reservationService.createReservation({
                userId: user.id,
                bookId: book.bookId
            });
            toast.success("Sukces! Zarezerwowano książkę.");
        } catch (error) {
            console.error(error);
            toast.error("Nie udało się zarezerwować książki.");
        }
    }

    // Obsługa dodawania nowej kopii
    const handleAddCopy = async () => {
        if (!book) return;
        try {
            await bookCopyService.addCopy(book.bookId, "AVAILABLE");
            toast.success("Dodano nowy egzemplarz!");
            loadCopies(book.bookId);
            setTimeout(() => setMessage(""), 3000);
        } catch (error) {
            toast.error("Błąd podczas dodawania egzemplarza.");
        }
    };

    // Obsługa usuwania kopii
    // nie wiem jeszcze dlaczego, ale nie można usunąć kopii (jako admin)
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
    const showReserveButton = availableCopiesCount === 0 && !canEdit;

    // URL okładki książki (jak w BookCopy)
    const coverUrl = book.isbn
        ? `https://covers.openlibrary.org/b/isbn/${book.isbn}-L.jpg?default=false`
        : null;

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-12">

            {showRentModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md border-gray-100">
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

            <div className="max-w-5xl mx-auto">
                {/* --- Nagłówek i powrót --- */}
                <div className="flex justify-between items-center mb-6">
                    <Link to="/books" className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition-colors font-medium">
                        <ArrowBack fontSize="small" /> Wróć do listy
                    </Link>
                    {canEdit && (
                        <Link to={`/books/update/${book.bookId}`} className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-bold bg-indigo-50 px-4 py-2 rounded-lg transition-colors border border-indigo-100">
                            <Edit fontSize="small" /> Edytuj dane
                        </Link>
                    )}
                </div>

                {/* --- GŁÓWNA KARTA KSIĄŻKI --- */}
                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden mb-8">
                    <div className="p-8">
                        <div className="flex flex-col md:flex-row gap-8">

                            {/* Lewa kolumna - okładka + dane */}
                            <div className="md:w-1/3 flex flex-col gap-6">
                                {/* Sekcja okładki */}
                                <div className="w-full bg-gray-100 rounded-xl overflow-hidden border border-gray-200 shadow-sm flex items-center justify-center min-h-[300px]">
                                    {!imgError && coverUrl ? (
                                        <img
                                            src={coverUrl}
                                            alt={`Okładka ${book.title}`}
                                            className="max-h-100 w-auto object-contain shadow-lg rounded-md hover:scale-105 transition-transform duration-500"
                                            onError={() => setImgError(true)}
                                        />
                                    ) : (
                                        <div className="text-center p-6 text-gray-400">
                                            <MenuBook style={{ fontSize: 64, marginBottom: '10px' }} />
                                            <p className="text-sm font-medium">Brak okładki</p>
                                        </div>
                                    )}
                                </div>
                                {/* Dane szczegółowe pod zdjęciem */}
                                <div className="space-y-3 pt-2">
                                    <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight mb-2">{book.title}</h1>
                                    <p><span className="font-semibold text-gray-400 uppercase text-xs tracking-wider">Autor:</span> <span className="text-gray-900 font-medium text-lg block">{book.author}</span></p>
                                    <p><span className="font-semibold text-gray-400 uppercase text-xs tracking-wider">ISBN:</span> <span className="text-gray-900 font-medium text-lg block">{book.isbn}</span></p>
                                    <p><span className="font-semibold text-gray-400 uppercase text-xs tracking-wider">Rok wydania:</span> <span className="text-gray-900 font-medium text-lg block">{book.publishYear}</span></p>
                                    <p><span className="font-semibold text-gray-400 uppercase text-xs tracking-wider">Wydawnictwo:</span> <span className="text-gray-900 font-medium text-lg block">{book.publisher}</span></p>
                                </div>
                                <div className="flex flex-wrap gap-2 pt-2">
                                    {book.categoryNames?.map((cat, index) => (
                                        <span key={index} className="px-3 py-1 bg-gray-100 text-gray-600 text-sm font-medium rounded-full border border-gray-200">
                                            {cat}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Prawa kolumna - opis */}
                            <div className="flex-1 bg-gray-50 p-6 rounded-xl border border-gray-100 h-full">
                                <h3 className="font-bold text-gray-800 mb-3 border-b border-gray-200 pb-2">Opis</h3>
                                <p className="text-gray-600 leading-relaxed text-sm">
                                    {book.description || "Brak opisu dla tej pozycji."}
                                </p>
                            </div>
                        </div>

                        {/* Baner o rezerwacji */}
                        {showReserveButton && (
                            <div className="mt-8 bg-amber-50 border border-amber-200 rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div className="flex items-center gap-3 text-amber-800">
                                    <WarningAmber />
                                    <div>
                                        <p className="font-bold">Brak dostępnych egzemplarzy</p>
                                        <p className="text-sm opacity-90">Możesz zarezerwować tę książkę, aby otrzymać powiadomienie.</p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleReserve}
                                    className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-lg shadow-sm transition-all whitespace-nowrap"
                                >
                                    Zarezerwuj
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sekcja egzemplarzy */}
                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-50">
                        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                            Dostępne egzemplarze
                            <span className="px-2 py-0.5 bg-white border border-gray-200 rounded-full text-xs text-gray-500">
                                {copies.length}
                            </span>
                        </h3>
                        {canEdit && (
                            <button
                                onClick={handleAddCopy}
                                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-bold rounded-lg transition-colors shadow-sm"
                            >
                                {/* POPRAWKA 4: Poprawiono fontsize -> fontSize */}
                                <AddCircleOutline fontSize="small" /> Dodaj Egzemplarz
                            </button>
                        )}
                    </div>

                    {copies.length === 0 ? (
                        <div className="p-12 text-center text-gray-400 border-dashed border-2 border-gray-50 m-6 rounded-xl">
                            Brak egzemplarzy w systemie.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-white border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">ID Egzemplarza</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                                    {canEdit && <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-wider">Akcje</th>}
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                {copies.map((copy) => (
                                    <tr key={copy.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-600">
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
                                                <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                                                    copy.status === 'AVAILABLE' ? 'bg-green-500' :
                                                        copy.status === 'LOANED' ? 'bg-red-500' : 'bg-yellow-500'
                                                }`}></span>
                                                {copy.status}
                                            </span>
                                        </td>
                                        {canEdit && (
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    {(copy.status === 'AVAILABLE' || copy.status === 'RESERVED') && (
                                                        <button
                                                            onClick={() => openRentModal(copy.id)}
                                                            className="px-3 py-1 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-md text-xs font-bold transition-colors"
                                                        >
                                                            Wypożycz
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => handleDeleteCopy(copy.id)}
                                                        disabled={copy.status !== 'AVAILABLE'}
                                                        className={`px-3 py-1 rounded-md text-xs font-bold transition-colors ${
                                                            copy.status !== 'AVAILABLE'
                                                                ? 'text-gray-300 cursor-not-allowed bg-gray-50'
                                                                : 'bg-red-50 text-red-600 hover:bg-red-100'
                                                        }`}
                                                        title={copy.status !== 'AVAILABLE' ? "Nie można usunąć wypożyczonego egzemplarza" : "Usuń"}
                                                    >
                                                        <Delete fontSize="small" />
                                                    </button>
                                                </div>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BookDetailsPage;
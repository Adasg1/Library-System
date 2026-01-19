import React, {useEffect, useMemo, useState} from 'react';
import { useParams, Link } from 'react-router';
import { bookService } from "../services/bookService.js";
import { bookCopyService } from "../services/bookCopyService.js";
import { reservationService } from "../services/reservationService.js";
import { useAuth } from "../context/AuthContext.jsx";
import {ArrowBack, Edit, MenuBook, BookmarkBorder, Settings, AutoStories} from '@mui/icons-material';
import {toast, ToastContainer} from "react-toastify";
import RentBookModal from "../components/RentModal.jsx";
import ManageCopiesModal from "../components/ManageCopiesModal.jsx";
import BookCard from "../components/BookCard.jsx";
import BookOpinions from "../components/BookOpinions.jsx";

const BookDetailsPage = () => {
    const { id } = useParams();
    const { user } = useAuth();

    const [book, setBook] = useState(null);
    const [copies, setCopies] = useState([]);
    const [imgError, setImgError] = useState(false);

    const [relatedBooks, setRelatedBooks] = useState([]);

    const [showRentModal, setShowRentModal] = useState(false);
    const [showManageModal, setShowManageModal] = useState(false);
    const [selectedCopyForRent, setSelectedCopyForRent] = useState(null);

    const canEdit = user?.role === 'ADMIN' || user?.role === 'LIBRARIAN';

    useEffect(() => {
        const loadBookDetails = async () => {
            setImgError(false);
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

    useEffect(() => {
        if (!book) return;

        const fetchRelatedBooks = async () => {
            try {
                const data = await bookService.getRelatedBooks(book.bookId);

                setRelatedBooks(data);
            } catch (error) {
                console.error("Błąd pobierania podobnych książek", error);
            }
        };

        fetchRelatedBooks();
    }, [book]);

    const loadCopies = async (bookId) => {
        try{
            const copiesData = await bookCopyService.getCopiesByBookId(bookId);
            setCopies(copiesData);
        } catch (error) {
            console.error("Błąd pobierania kopii.", error);
        }
    };

    const refreshCopies = () => {
        if (book?.bookId) { loadCopies(book.bookId); }
    };

    const handleOpenRentModal = (copyId) => {
        setSelectedCopyForRent(copyId);
        setShowRentModal(true);
    };

    const handleDeleteDummy = () => {
        // Nic nie robimy, bo w sekcji "Podobne" nie chcemy dawać opcji usuwania
        console.log("Usuwanie zablokowane w tym widoku");
    };

    const handleReservation = async (book) => {
        if (window.confirm(`Czy na pewno chcesz zarezerwować książkę: ${book.title}`)) {
            try {
                const reservation = await reservationService.createReservation({bookId: book.bookId})
                if (reservation.status === "READY") {
                    const formattedDate = new Date(reservation.maxPickupDate).toLocaleString('pl-PL', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    });
                    refreshCopies();

                    toast.success(
                        <div>
                            <p className="font-bold">📚 Zarezerwowano: "{book.title}"</p>
                            <p className="text-sm">Czas na odbiór do: <strong>{formattedDate}</strong></p>
                        </div>,
                        { position: "top-right", autoClose: 8000 }
                    );
                } else if (reservation.status === "WAITING") {
                    toast.success(`📚 Zarezerwowano: "${book.title}"! Powiadomimy cie mailowo, gdy tytuł będzie dostępny`, {
                        position: "top-right",
                        autoClose: 8000,
                    });
                }

            } catch (e) {
                console.log(e);
                toast.error(`📚 Rezerwacja "${book.title}"  nie powiodła się! Być może już ją zarezerwowałeś ?`, {
                    position: "top-right",
                    autoClose: 8000,
                });
            }
        }
    }

    const availableCopiesCount = useMemo(() => {
        return copies.filter(c => c.status === 'AVAILABLE').length;
    }, [copies])



    if (!book){
        return <div className="p-8 text-center text-gray-500">Ładowanie szczegółów...</div>;
    }

    const coverUrl = book.isbn
        ? `https://covers.openlibrary.org/b/isbn/${book.isbn}-L.jpg?default=false`
        : null;

    const isAvailable = availableCopiesCount > 0;
    const containerClass = isAvailable
        ? "bg-blue-50 border-blue-100"
        : "bg-red-50 border-red-100";

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-12 relative">
            <ToastContainer />

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
                                            <p className="text-sm font-medium">{book.title}</p>
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

                                <div className={`${containerClass} border  rounded-xl p-5 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4`}>
                                    <div>
                                        <p className={`${isAvailable ? 'text-blue-900' : 'text-red-900'} font-medium text-sm uppercase tracking-wide mb-1`}>Dostępność w bibliotece</p>
                                        <div className="flex items-baseline gap-2">
                                            {availableCopiesCount > 0 ? (
                                                <>
                                                    <span className="text-blue-800">Ilość dostępnych egzemplarzy: </span>
                                                    <span className="text-3xl font-bold text-blue-700">
                                                        {availableCopiesCount}
                                                    </span>
                                                </>
                                            ) : (
                                                <span className="text-red-700 font-bold text-lg">
                                                    Brak dostępnych egzemplarzy
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => handleReservation(book)}
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

                {relatedBooks.length > 0 && (
                    <div className="animate-fadeIn">
                        <div className="flex items-center gap-2 mb-6 border-b border-gray-200 pb-4">
                            <AutoStories className="text-indigo-500" />
                            <h2 className="text-2xl font-bold text-gray-800">Zobacz również</h2>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {relatedBooks.map(relatedBook => (
                                <BookCard
                                    key={relatedBook.bookId}
                                    book={relatedBook}
                                    user={user}
                                    onReservation={handleReservation}
                                    onDelete={handleDeleteDummy}
                                />
                            ))}
                        </div>
                    </div>
                )}
                <BookOpinions bookId={book.bookId} user={user} />

            </div>
            <ManageCopiesModal
                open={showManageModal}
                onClose={() => setShowManageModal(false)}
                bookId={book.bookId}
                copies={copies}
                onRefresh={refreshCopies}
                onRentClick={handleOpenRentModal}
            />
            <RentBookModal
                open={showRentModal}
                onClose={() => setShowRentModal(false)}
                copyId={selectedCopyForRent}
                onRentSuccess={refreshCopies}
            />
        </div>
    );
};

export default BookDetailsPage;
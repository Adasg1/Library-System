import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { useAuth } from "../context/AuthContext.jsx";
import { bookService } from "../services/bookService.js";
import { reservationService } from "../services/reservationService.js";
import BookCard from "../components/BookCard.jsx";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
    BookOutlined,
    AccountCircleOutlined,
    AddBoxOutlined,
    PeopleAltOutlined,
    LibraryBooks,
    TrendingUp,
    NewReleases
} from '@mui/icons-material';

const HomePage = () => {
    const { user } = useAuth();
    const isStaff = user?.role === 'ADMIN' || user?.role === 'LIBRARIAN';

    const [newestBooks, setNewestBooks] = useState([]);
    const [popularBooks, setPopularBooks] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            fetchStats();
        }
    }, [user]);

    const fetchStats = async () => {
        setLoading(true);
        try {
            const [newest, popular] = await Promise.all([
                bookService.getNewestBooks(),
                bookService.getPopularBooks(4),
            ]);
            setNewestBooks(newest);
            setPopularBooks(popular);
        } catch (error) {
            console.error("Błąd pobierania statystyk: ", error);
        } finally {
            setLoading(false);
        }
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

                    toast.success(
                        <div>
                            <p className="font-bold">📚 Zarezerwowano: "{book.title}"</p>
                            <p className="text-sm">Czas na odbiór do: <strong>{formattedDate}</strong></p>
                        </div>,
                        { position: "top-right", autoClose: 5000 }
                    );
                } else if (reservation.status === "WAITING") {
                    toast.success(`📚 Zarezerwowano: "${book.title}"! Powiadomimy cie mailowo, gdy tytuł będzie dostępny`, {
                        position: "top-right",
                        autoClose: 5000,
                    });
                }

            } catch (e) {
                console.log(e);
                toast.error(`📚 Rezerwacja "${book.title}"  nie powiodła się!`, {
                    position: "top-right",
                    autoClose: 5000,
                });
            }
        }
    }

    const handleDelete = async (id) => {
        if (window.confirm("Czy na pewno chcesz usunąć tę książkę?")) {
            try {
                await bookService.deleteBook(id);
                setBooks(prevBooks => prevBooks.filter(book => book.bookId !== id));
            } catch (error) {
                console.error("Błąd usuwania:", error);
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 p-6 md:p-12">
            <ToastContainer />

            {/* Header / Hero Section */}
            <header className="max-w-6xl mx-auto mb-12 text-center">
                <div className="inline-block p-3 bg-indigo-50 rounded-2xl mb-4">
                    <LibraryBooks sx={{ fontSize: 48, color: '#646cff' }} />
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-gray-900">
                    Witamy w <span className="text-[#646cff]">Mole Książkowe</span>
                </h1>
                <p className="text-gray-500 text-lg max-w-2xl mx-auto">
                    Twoje centrum dowodzenia literackim światem. Przeglądaj, wypożyczaj i zarządzaj swoją domową biblioteką.
                </p>
            </header>

            <div className="max-w-7xl mx-auto">
                {user ? (
                    <div className="space-y-12">
                        {/* Powitanie */}
                        <div className="bg-white border border-gray-200 p-8 rounded-2xl shadow-sm">
                            <h2 className="text-2xl font-bold">
                                Witaj z powrotem, <span className="text-[#646cff]">{user.firstName || 'Użytkowniku'}</span>! 👋
                            </h2>
                            <p className="text-gray-500 mt-1">Cieszymy się, że znowu jesteś z nami.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <Link to="/books" className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-200 hover:border-indigo-400 shadow-sm hover:shadow-md transition-all">
                                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg"><BookOutlined /></div>
                                <div className="font-bold">Katalog</div>
                            </Link>
                            <Link to="/profile" className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-200 hover:border-indigo-400 shadow-sm hover:shadow-md transition-all">
                                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg"><AccountCircleOutlined /></div>
                                <div className="font-bold">Mój Profil</div>
                            </Link>
                            {isStaff && (
                                <Link to="/books/new" className="flex items-center gap-4 p-4 bg-white rounded-xl border border-orange-200 hover:border-orange-400 shadow-sm hover:shadow-md transition-all">
                                    <div className="p-3 bg-orange-50 text-orange-600 rounded-lg"><AddBoxOutlined /></div>
                                    <div className="font-bold">Dodaj Książkę</div>
                                </Link>
                            )}
                            {user?.role === 'ADMIN' && (
                                <Link to="/admin/users" className="flex items-center gap-4 p-4 bg-white rounded-xl border border-red-200 hover:border-red-400 shadow-sm hover:shadow-md transition-all">
                                    <div className="p-3 bg-red-50 text-red-600 rounded-lg"><PeopleAltOutlined /></div>
                                    <div className="font-bold">Użytkownicy</div>
                                </Link>
                            )}
                            {isStaff && (
                                <Link to="/admin/loans" className="flex items-center gap-4 p-4 bg-white rounded-xl border border-red-200 hover:border-red-400 shadow-sm hover:shadow-md transition-all">
                                    <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg"><BookOutlined /></div>
                                    <div className="font-bold">Zarządzanie wypożyczeniami</div>
                                </Link>
                            )}
                        </div>


                        {popularBooks.length > 0 && (
                            <section>
                                <div className="flex items-center gap-2 mb-6">
                                    <TrendingUp className="text-red-500" />
                                    <h2 className="text-2xl font-bold text-gray-800">Najchętniej wypożyczane</h2>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {popularBooks.map(book => (
                                        <BookCard
                                            key={book.bookId}
                                            book={book}
                                            user={user}
                                            onReservation={handleReservation}
                                            onDelete={handleDelete}
                                        />
                                    ))}
                                </div>
                            </section>
                        )}

                        {newestBooks.length > 0 && (
                            <section>
                                <div className="flex items-center gap-2 mb-6">
                                    <NewReleases className="text-green-500" />
                                    <h2 className="text-2xl font-bold text-gray-800">Ostatnio dodane nowości</h2>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {newestBooks.map(book => (
                                        <BookCard
                                            key={book.bookId}
                                            book={book}
                                            user={user}
                                            onReservation={handleReservation}
                                            onDelete={handleDelete}
                                        />
                                    ))}
                                </div>
                            </section>
                        )}

                        {loading && <div className="text-center py-10 text-gray-400">Ładowanie statystyk...</div>}
                    </div>
                ) : (
                    /* Widok dla niezalogowanego */
                    <div className="bg-white border border-gray-200 p-12 rounded-3xl text-center shadow-xl max-w-3xl mx-auto">
                        {/* ... tu było ok ... */}
                        <div className="mb-6 inline-flex items-center justify-center w-20 h-20 bg-indigo-50 rounded-full text-[#646cff]">
                            <LibraryBooks sx={{ fontSize: 40 }} />
                        </div>
                        <h2 className="text-3xl font-bold mb-4 text-gray-900">Zacznij czytać już teraz</h2>
                        <p className="text-gray-500 mb-10 text-lg leading-relaxed">
                            Załóż bezpłatne konto, aby rezerwować książki online, tworzyć listy życzeń i śledzić swoje postępy w czytaniu.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <Link to="/login" className="px-10 py-3 bg-[#646cff] hover:bg-[#535bf2] text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-200">
                                Zaloguj się
                            </Link>
                            <Link to="/register" className="px-10 py-3 bg-white border-2 border-gray-200 hover:border-[#646cff] hover:text-[#646cff] text-gray-700 font-bold rounded-xl transition-all">
                                Załóż konto
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HomePage;
import React, { useEffect, useState } from 'react';
import { bookService } from "../services/bookService.js";
import { useAuth } from "../context/AuthContext.jsx";
import { Link } from "react-router-dom";
import CategoriesSideBar from "../components/CategoriesSideBar.jsx";
import BookCard from "../components/BookCard.jsx";
import {reservationService} from "../services/reservationService.js";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BookListPage = () => {
    const [books, setBooks] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadBooks();
    }, [selectedCategory]);

    const loadBooks = async () => {
        setLoading(true);
        try {
            let data;
            if (selectedCategory) {
                data = await bookService.getAllBooksBrief(); // TODO pobieranie po kategorii
            } else {
                data = await bookService.getAllBooksBrief();
            }
            console.log("Pobrane książki:", data);
            setBooks(data);
        } catch (error) {
            console.error("Błąd pobierania książek:", error);
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

    const canAdd = user?.role === 'ADMIN' || user?.role === 'LIBRARIAN';

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
            <ToastContainer />

            {/* --- SIDEBAR --- */}
            <div className="w-full md:w-64 bg-white border-r border-gray-200 md:min-h-screen shrink-0">
                <div className="p-4 md:fixed md:w-64 md:h-full md:overflow-y-auto">
                    <CategoriesSideBar
                        onSelectCategory={(category) => setSelectedCategory(category)}
                        selectedCategory={selectedCategory}
                    />
                </div>
            </div>

            {/* --- GŁÓWNA ZAWARTOŚĆ --- */}
            <div className="flex-1 p-6 md:p-8">
                <div className="max-w-7xl mx-auto">

                    {/* Nagłówek + Przycisk dodawania */}
                    <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
                        <h1 className="text-3xl font-bold text-gray-800">
                            {selectedCategory ? 'Książki z kategorii: ' + selectedCategory.categoryName : 'Katalog Książek'}
                        </h1>

                        {canAdd && (
                            <Link to="/books/new">
                                <button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition-all flex items-center gap-2">
                                    <span>+ Dodaj Książkę</span>
                                </button>
                            </Link>
                        )}
                    </div>

                    {/* Loader */}
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        </div>
                    ) : (
                        /* Grid Książek */
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {books.length > 0 ? (
                                books.map((book) => (
                                    <BookCard
                                        key={book.bookId}
                                        book={book}
                                        user={user}
                                        onReservation={handleReservation}
                                        onDelete={handleDelete}
                                    />
                                ))
                            ) : (
                                <div className="col-span-full text-center py-12 text-gray-500">
                                    Brak książek w tej kategorii.
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BookListPage;
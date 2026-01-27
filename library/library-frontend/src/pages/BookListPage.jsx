import React, { useEffect, useState } from 'react';
import { bookService } from "../services/bookService.js";
import { useAuth } from "../context/AuthContext.jsx";
import { Link } from "react-router-dom";
import CategoriesSideBar from "../components/CategoriesSideBar.jsx";
import BookCard from "../components/BookCard.jsx";
import {reservationService} from "../services/reservationService.js";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Search } from '@mui/icons-material';

const BookListPage = () => {
    const [books, setBooks] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [sortType, setSortType] = useState("title");
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        loadBooks();
    }, [selectedCategory, sortType]);

    const loadBooks = async () => {
        setLoading(true);
        try {
            let data;
            if (selectedCategory) {
                const categoryId = typeof selectedCategory === 'object' ? selectedCategory.categoryId : selectedCategory;
                data = await bookService.getBooksByCategory(categoryId, sortType);
            } else {
                data = await bookService.getAllBooksBrief(sortType);
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

    const handleSortChange = (e) => {
        setSortType(e.target.value);
    };

    const canAdd = user?.role === 'ADMIN' || user?.role === 'LIBRARIAN';

    const filteredBooks = books.filter((book) => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (
            book.title.toLowerCase().includes(query) ||
            book.author.toLowerCase().includes(query)
        );
    });

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

                    {/* Nagłówek + Narzędzia */}
                    <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
                        <h1 className="text-3xl font-bold text-gray-800">
                            {selectedCategory ? 'Książki z kategorii: ' + selectedCategory.categoryName : 'Katalog Książek'}
                        </h1>

                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full xl:w-auto">

                            <div className="relative flex-1 sm:flex-initial">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                    <Search fontSize="small" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Szukaj tytułu lub autora..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                />
                            </div>

                            <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-gray-200 shadow-sm">
                                <span className="text-sm font-medium text-gray-500">Sortuj:</span>
                                <select
                                    value={sortType}
                                    onChange={handleSortChange}
                                    className="text-sm font-semibold text-gray-700 bg-transparent outline-none cursor-pointer"
                                >
                                    <option value="title">Alfabetycznie (A-Z)</option>
                                    <option value="newest">Najnowsze</option>
                                    <option value="popular">Popularność</option>
                                    <option value="availability">Dostępność</option>
                                </select>
                            </div>

                            {canAdd && (
                                <Link to="/books/new">
                                    <button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition-all flex items-center gap-2">
                                        <span>+ Dodaj Książkę</span>
                                    </button>
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Loader */}
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        </div>
                    ) : (
                        /* Grid Książek */
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredBooks.length > 0 ? (
                                filteredBooks.map((book) => (
                                    <BookCard
                                        key={book.bookId}
                                        book={book}
                                        user={user}
                                        onReservation={handleReservation}
                                        onDelete={handleDelete}
                                    />
                                ))
                            ) : (
                                <div className="col-span-full text-center py-12 text-gray-500 flex flex-col items-center">
                                    <Search style={{ fontSize: 48, opacity: 0.2, marginBottom: 10 }} />
                                    <p>Nie znaleziono książek pasujących do zapytania.</p>
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
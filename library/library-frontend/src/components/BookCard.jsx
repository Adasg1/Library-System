import React, { useState } from 'react';
import { Link } from 'react-router';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const BookCard = ({ book, user, onReservation, onDelete }) => {
    const [imgError, setImgError] = useState(false);

    const canEdit = user?.role === 'ADMIN' || user?.role === 'LIBRARIAN';
    const canDelete = user?.role === 'ADMIN';

    const coverUrl = book.isbn
        ? `https://covers.openlibrary.org/b/isbn/${book.isbn}-L.jpg?default=false`
        : null;

    return (
        <div className="flex flex-col bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 hover:scale-[1.02] overflow-hidden h-full">

            {/* --- SEKCJA ZDJĘCIA --- */}
            <div className="h-64 w-full bg-gray-100 relative group">
                {!imgError && coverUrl ? (
                    <img
                        src={coverUrl}
                        alt={`Okładka ${book.title}`}
                        className="w-full h-full object-contain p-2"
                        onError={() => setImgError(true)}
                        loading="lazy"
                    />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 p-4 text-center">
                        <MenuBookIcon style={{ fontSize: 48, marginBottom: '8px', opacity: 0.5 }} />
                        <span className="text-xs font-semibold text-gray-500 line-clamp-2">
                            {book.title}
                        </span>
                    </div>
                )}

                <Link
                    to={`/books/details/${book.bookId}`}
                    className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100"
                >
                    <span className="bg-white text-gray-800 px-4 py-2 rounded-full font-bold shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform">
                        Zobacz szczegóły
                    </span>
                </Link>
            </div>

            {/* --- TREŚĆ KARTY --- */}
            <div className="p-4 flex flex-col flex-1">
                {/* Tytuł i Autor */}
                <div className="mb-4">
                    <h3 className="font-bold text-lg text-gray-800 leading-tight line-clamp-2 mb-1" title={book.title}>
                        {book.title}
                    </h3>
                    <p className="text-sm text-gray-500 font-medium">{book.author}</p>
                </div>

                {/* Status dostępności */}
                <div className="mt-auto flex items-center justify-between">
                    <div className="text-sm">
                        {book.availableCopies > 0 ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <span className="w-2 h-2 mr-1 bg-green-500 rounded-full"></span>
                                Dostępna ({book.availableCopies})
                            </span>
                        ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                <span className="w-2 h-2 mr-1 bg-red-500 rounded-full"></span>
                                Wypożyczona
                            </span>
                        )}
                    </div>
                </div>

                {/* --- PRZYCISKI AKCJI --- */}
                <div className="mt-4 pt-3 border-t border-gray-100 flex gap-2">
                    <button
                        className={`flex-1 text-sm font-semibold py-2 px-3 rounded transition-colors
                                bg-blue-600 hover:bg-blue-700 text-white shadow-sm`}
                        onClick={() => onReservation(book)}
                    >
                        {'Zarezerwuj'}
                    </button>

                    {/* Przyciski Admina (Edycja/Usuwanie) */}
                    {(canEdit || canDelete) && (
                        <div className="flex gap-1 ml-1 border-l pl-2 border-gray-200">
                            {canEdit && (
                                <Link
                                    to={`/books/update/${book.bookId}`}
                                    className="p-2 text-yellow-600 hover:bg-yellow-50 rounded transition-colors"
                                    title="Edytuj"
                                >
                                    <EditIcon fontSize="small" />
                                </Link>
                            )}
                            {canDelete && (
                                <button
                                    onClick={() => onDelete(book.bookId)}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                                    title="Usuń"
                                >
                                    <DeleteIcon fontSize="small" />
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BookCard;
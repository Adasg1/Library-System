import React, { useEffect, useState } from 'react';
import { bookService } from "../services/bookService.js";
import { useAuth } from "../context/AuthContext.jsx";
import { Link } from "react-router";

const BookListPage = () => {
    const [books, setBooks] = useState([]);
    const { user } = useAuth();
    const [message, setMessage] = useState("");

    useEffect(() => {
        loadBooks();
    }, []);

    const loadBooks = async () => {
        try {
            // Ładuje tylko część informacji o książkach (brief)
            // Szczegóły są dostępne po kliknięciu w daną książkę
            const data = await bookService.getAllBooksBrief();
            setBooks(data);
        } catch (error) {
            console.log(error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Czy na pewno chcesz usunąć tę książkę?")) {
            try {
                await bookService.deleteBook(id);
                loadBooks();
            } catch (error) {
                console.log(error);
            }
        }
    };

    // const handleBorrow = async (id) => {
    //     // na przyszłość do wypożyczania książek
    // }

    // uprawnienia
    const canAdd = user?.role === 'ADMIN' || user?.role === 'LIBRARIAN';
    const canDelete = user?.role === 'ADMIN';

    return (
        <div className="bookListPage" style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
            <h1>Katalog Książek</h1>
            {message && <div style={{ padding: '10px', background: '#e0f7fa', marginBottom: '20px', color: '#006064' }}>{message}</div>}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
                {books.map((book) => (
                    <div key={book.bookId} className="card" style={{
                        border: '1px solid #444',
                        borderRadius: '8px',
                        padding: '20px',
                        textAlign: 'left',
                        backgroundColor: '#2a2a2a',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                    }}>
                        <div>
                            <Link to={`/books/details/${book.bookId}`} style={{ textDecoration: 'none' }}>
                                <h3 style={{ marginTop: 0, color: '#646cff', cursor: 'pointer' }}>{book.title}</h3>
                            </Link>

                            <p style={{ margin: '5px 0', color: '#ccc' }}><strong>Autor:</strong> {book.author}</p>
                        </div>

                        <div style={{ marginTop: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                            <Link to={`/books/details/${book.bookId}`} style={{ flex: 1 }}>
                                <button style={{ width: '100%', backgroundColor: '#646cff' }}>Szczegóły</button>
                            </Link>

                            {/* Opcje administracyjne */}
                            {canAdd && (
                                <Link to={`/books/update/${book.bookId}`} style={{ textDecoration: 'none', display: 'flex'}}>
                                    <button style={{ fontSize: '0.8em', padding: '5px 10px' }}>Edytuj</button>
                                </Link>
                            )}

                            {canDelete && (
                                <button onClick={() => handleDelete(book.bookId)} style={{ backgroundColor: '#d32f2f', fontSize: '0.8em', padding: '5px 10px' }}>Usuń</button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {canAdd && (
                <div style={{ marginBottom: '20px', marginTop: '20px' }}>
                    <Link to="/books/new">
                        <button style={{ backgroundColor: '#4CAF50' }}>Dodaj książkę</button>
                    </Link>
                </div>
            )}

        </div>
    );
};

export default BookListPage;
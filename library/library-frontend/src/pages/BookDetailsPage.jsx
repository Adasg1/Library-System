import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router';
import { bookService } from "../services/bookService.js";
import { useAuth } from "../context/AuthContext.jsx";

const BookDetailsPage = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const [book, setBook] = useState(null);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const loadBookDetails = async () => {
            try {
                const data = await bookService.getFullBookById(id);
                setBook(data);
            } catch (error) {
                console.log(error);
                setMessage("Nie udało się pobrać szczegółów książki.");
            }
        };
        loadBookDetails();
    }, [id]);

    if (!book){
        return <div style={{ padding: '20px', textAlign: 'center' }}>Ładowanie szczegółów...</div>;
    }

    const canEdit = user?.role === 'ADMIN' || user?.role === 'LIBRARIAN';

    return (
        <div className="card" style={{ maxWidth: '800px', margin: '20px auto', padding: '30px', textAlign: 'left' }}>
            {message && <div style={{ padding: '10px', background: '#e0f7fa', marginBottom: '20px', color: '#006064' }}>{message}</div>}

            <h1 style={{ marginTop: 0, color: '#646cff' }}>{book.title}</h1>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                    <p><strong>Autor:</strong> {book.author}</p>
                    <p><strong>ISBN:</strong> {book.isbn}</p>
                    <p><strong>Wydawnictwo:</strong> {book.publisher}</p>
                    <p><strong>Rok wydania:</strong> {book.publishYear}</p>
                </div>
                <div>
                    <p><strong>Kategorie:</strong></p>
                    <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                        {book.categoryNames && book.categoryNames.map((cat, index) => (
                            <span key={index} style={{ background: '#444', padding: '2px 8px', borderRadius: '4px', fontSize: '0.9em' }}>
                                {cat}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            <hr style={{ borderColor: '#444', margin: '20px 0' }} />

            <h3>Opis:</h3>
            <p style={{ lineHeight: '1.6', color: '#ddd' }}>
                {book.description || "Brak opisu dla tej pozycji."}
            </p>

            <div style={{ marginTop: '30px', display: 'flex', gap: '15px' }}>

                {/* Edycja dla admina/bibliotekarza */}
                {canEdit && (
                    <Link to={`/books/update/${book.bookId}`}>
                        <button style={{ backgroundColor: '#ff9800', color: 'black' }}>Edytuj dane</button>
                    </Link>
                )}

                <Link to="/books">
                    <button style={{ background: '#555' }}>Wróć do listy</button>
                </Link>
            </div>
        </div>
    );
};

export default BookDetailsPage;
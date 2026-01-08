import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router';
import { bookService } from "../services/bookService.js";
import { loanService } from "../services/loanService.js";
import { bookCopyService } from "../services/bookCopyService.js";
import { userService } from "../services/userService.js";
import { reservationService } from "../services/reservationService.js";
import { useAuth } from "../context/AuthContext.jsx";

const BookDetailsPage = () => {
    const { id } = useParams();
    const { user } = useAuth();

    const [book, setBook] = useState(null);
    const [copies, setCopies] = useState([]);
    const [message, setMessage] = useState("");

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
                console.log(error);
                setMessage("Nie udało się pobrać szczegółów książki.");
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
            console.error("Błąd pobierania kopii:", error);
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
                console.error("Błąd pobierania użytkowników", error);
                setMessage("Nie udało sie pobrać listy użytkowników.");
            }
        }
    };

    const handleRentSubmit = async () => {
        if (!selectedUserId) {
            alert("Wybierz użytkownika z listy!");
            return;
        }
        try{
            await loanService.rentBook(selectedUserId, selectedCopyForRent);
            setMessage(`Sukces! Wypożyczono egzemplarz dla użytkownika ID: ${selectedUserId}`);
            setShowRentModal(false);
            loadCopies(book.bookId);
        } catch (error) {
            console.error(error);
            setMessage("Błąd wypożyczania. Sprawdź czy użytkownik nie ma blokad.");
            setShowRentModal(false);
        }
    };

    const handleReserve = async () => {
        if (!user){
            alert("Musisz być zalogowany, aby zarezerwować.");
            return;
        }
        try {
            await reservationService.createReservation({
                userId: user.id,
                bookId: book.bookId
            });
            setMessage("Sukces! Zarezerwowane książkę. Otrzymasz powiadomienie, gdy będzie dostępna do odbioru.");
        } catch (error) {
            console.error(error);
            setMessage("Nie udało się zarezerwować książki.");
        }
    }

    // Obsługa dodawania nowej kopii
    const handleAddCopy = async () => {
        if (!book) return;
        try {
            await bookCopyService.addCopy(book.bookId, "AVAILABLE");
            setMessage("Dodano nowy egzemplarz!");
            loadCopies(book.bookId);
            setTimeout(() => setMessage(""), 3000);
        } catch (error) {
            setMessage("Błąd podczas dodawania egzemplarza.");
        }
    };

    // Obsługa usuwania kopii
    // nie wiem jeszcze dlaczego, ale nie można usunąć kopii (jako admin)
    const handleDeleteCopy = async (copyId) => {
        if(!window.confirm("Czy na pewno usunąć ten egzemplarz?")) return;
        try {
            await bookCopyService.deleteCopy(copyId);
            setMessage("Usunięto egzemplarz.");
            loadCopies(book.bookId);
        } catch (error) {
            setMessage("Nie można usunąć egzemplarza (być może jest wypożyczony).");
        }
    };

    // Kolory statusów (zielony - available, czerwony - loaned)
    const getStatusStyle = (status) => {
        switch (status) {
            case 'AVAILABLE': return { color: '#4caf50', fontWeight: 'bold' };
            case 'LOANED': return { color: '#f44336', fontWeight: 'bold' };
            default: return { color: '#ffa726' };
        }
    };

    if (!book){
        return <div style={{ padding: '20px', textAlign: 'center' }}>Ładowanie szczegółów...</div>;
    }

    const availableCopiesCount = copies.filter(c => c.status === 'AVAILABLE').length;
    const showReserveButton = availableCopiesCount === 0 && !canEdit;

    return (
        <div className="card" style={{ maxWidth: '800px', margin: '20px auto', padding: '30px', textAlign: 'left' }}>
            {showRentModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                    backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
                }}>
                    <div style={{ backgroundColor: '#2a2a2a', padding: '30px', borderRadius: '8px', minWidth: '400px', boxShadow: '0 4px 15px rgba(0,0,0,0.5)' }}>
                        <h3 style={{ marginTop: 0 }}>Wypożycz egzemplarz #{selectedCopyForRent}</h3>

                        <label style={{ display: 'block', marginBottom: '10px' }}>Wybierz czytelnika:</label>
                        <select
                            value={selectedUserId}
                            onChange={(e) => setSelectedUserId(e.target.value)}
                            style={{ width: '100%', padding: '10px', marginBottom: '20px', fontSize: '1rem' }}
                        >
                            <option value="">-- Wybierz z listy --</option>
                            {users.map((u) => (
                                <option key={u.id || u.userId} value={u.id || u.userId}>
                                    {u.email} ({u.firstName ? `${u.firstName} ${u.lastName}` : u.username})
                                </option>
                            ))}
                        </select>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                            <button onClick={() => setShowRentModal(false)} style={{ backgroundColor: '#555' }}>Anuluj</button>
                            <button onClick={handleRentSubmit} style={{ backgroundColor: '#2196f3' }}>Zatwierdź</button>
                        </div>
                    </div>
                </div>
            )}

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

            {showReserveButton && (
                <div style={{ margin: '20px 0', padding: '15px', border: '1px solid #9c27b0', borderRadius: '8px', backgroundColor: 'rgba(156, 39, 176, 0.1)' }}>
                    <h3 style={{ margin: '0 0 10px 0', color: '#ce93d8' }}>Brak dostępnych egzemplarzy</h3>
                    <p style={{ fontSize: '0.9em', marginBottom: '15px' }}>
                        Wszystkie egzemplarze są obecnie wypożyczone. Możesz zarezerwować tę książkę, aby otrzymać powiadomienie, gdy tylko wróci do biblioteki.
                    </p>
                    <button
                        onClick={handleReserve}
                        style={{ backgroundColor: '#9c27b0', color: 'white', border: 'none', padding: '10px 20px', fontSize: '1em', cursor: 'pointer' }}
                    >
                        Zarezerwuj
                    </button>
                </div>
            )}

            <div style={{ marginTop: '40px', background: '#2a2a2a', padding: '20px', borderRadius: '8px' }}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px'}}>
                    <h3 style={{margin: 0}}>Egzemplarze ({copies.length})</h3>
                    {canEdit && (
                        <button onClick={handleAddCopy} style={{ backgroundColor: '#4caf50', fontSize: '0.9em' }}>
                            + Dodaj Egzemplarz
                        </button>
                    )}
                </div>

                {copies.length === 0 ? (
                    <p style={{color: '#888'}}>Brak egzemplarzy w systemie.</p>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.95em' }}>
                        <thead>
                        <tr style={{ borderBottom: '1px solid #555', textAlign: 'left' }}>
                            <th style={{ padding: '10px' }}>ID</th>
                            <th style={{ padding: '10px' }}>Status</th>
                            {canEdit && <th style={{ padding: '10px', textAlign: 'right' }}>Akcje</th>}
                        </tr>
                        </thead>
                        <tbody>
                        {copies.map((copy) => (
                            <tr key={copy.id} style={{ borderBottom: '1px solid #333' }}>
                                <td style={{ padding: '10px' }}>#{copy.id}</td>
                                <td style={{ padding: '10px' }}>
                                    <span style={getStatusStyle(copy.status)}>{copy.status}</span>
                                </td>
                                {canEdit && (
                                    <td style={{ padding: '10px', textAlign: 'right' }}>
                                            {copy.status === 'AVAILABLE' && (
                                                <button onClick={() => openRentModal(copy.id)} style={{ marginRight: '10px', backgroundColor: '#2196f3', padding: '5px 10px', fontSize: '0.8em' }}>
                                                    Wypożycz
                                                </button>
                                            )}
                                            <button onClick={() => handleDeleteCopy(copy.id)} disabled={copy.status !== 'AVAILABLE'} style={{ backgroundColor: '#e53935', padding: '5px 10px', fontSize: '0.8em' }}>
                                                Usuń
                                            </button>
                                    </td>
                                )}
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>

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
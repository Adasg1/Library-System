import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router';
import { bookService } from '../services/bookService';
import { categoryService } from '../services/categoryService';

const BookFormPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [categories, setCategories] = useState([]);

    const [formData, setFormData] = useState({
        title: '',
        author: '',
        isbn: '',
        description: '',
        publisher: '',
        publishYear: new Date().getFullYear(),
        categoryIds: []
    });

    useEffect(() => {
        const loadData = async () => {
            try {
                const allCats = await categoryService.getAllCategories();
                setCategories(allCats);

                if (id) {
                    const book = await bookService.getFullBookById(id);

                    const preselectedIds = allCats
                        .filter(cat => book.categoryNames && book.categoryNames.includes(cat.name || cat.categoryName))
                        .map(cat => cat.id || cat.categoryId);

                    setFormData({
                        title: book.title,
                        author: book.author,
                        isbn: book.isbn,
                        description: book.description,
                        publisher: book.publisher,
                        publishYear: book.publishYear,
                        categoryIds: preselectedIds
                    });
                }
            } catch (err) {
                console.error(err);
            }
        };
        loadData();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCategoryChange = (e) => {
        const selectedValues = Array.from(e.target.selectedOptions, option => parseInt(option.value));
        setFormData(prev => ({ ...prev, categoryIds: selectedValues }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const selectedCategoryNames = categories
            .filter(cat => formData.categoryIds.includes(cat.id || cat.categoryId))
            .map(cat => cat.name || cat.categoryName);

        const payload = {
            title: formData.title,
            author: formData.author,
            isbn: formData.isbn,
            description: formData.description,
            publisher: formData.publisher,
            publishYear: parseInt(formData.publishYear),
            categoryNames: selectedCategoryNames
        };

        try {
            if (id) {
                await bookService.updateBook(id, payload);
            } else {
                await bookService.createBook(payload);
            }
            navigate('/books');
        } catch (error) {
            alert("Błąd zapisu. Sprawdź konsolę.");
            console.error(error);
        }
    };

    return (
        <div className="card" style={{ maxWidth: '600px', margin: '20px auto', padding: '20px' }}>
            <h2>{id ? 'Edytuj Książkę' : 'Dodaj Nową Książkę'}</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', textAlign: 'left' }}>

                <label>Tytuł:</label>
                <input name="title" value={formData.title} onChange={handleChange} required />

                <label>Autor:</label>
                <input name="author" value={formData.author} onChange={handleChange} required />

                <label>ISBN:</label>
                <input name="isbn" value={formData.isbn} onChange={handleChange} required />

                <label>Opis:</label>
                <textarea name="description" value={formData.description} onChange={handleChange} rows="3" />

                <label>Wydawnictwo:</label>
                <input name="publisher" value={formData.publisher} onChange={handleChange} required />

                <label>Rok wydania:</label>
                <input name="publishYear" type="number" value={formData.publishYear} onChange={handleChange} required />

                <label>Wybierz kategorie:</label>
                <select
                    multiple
                    name="categoryIds"
                    value={formData.categoryIds}
                    onChange={handleCategoryChange}
                    style={{
                        minHeight: '120px',
                        padding: '10px',
                        backgroundColor: '#333',
                        color: 'white',
                        border: '1px solid #555',
                        borderRadius: '4px'
                    }}
                >
                    {categories.length > 0 ? categories.map(cat => (
                        <option key={cat.id || cat.categoryId} value={cat.id || cat.categoryId}>
                            {cat.name || cat.categoryName}
                        </option>
                    )) : <option disabled>Brak kategorii / Ładowanie...</option>}
                </select>

                <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                    <button type="submit" style={{ flex: 1, backgroundColor: '#4CAF50' }}>Zapisz</button>
                    <Link to="/books" style={{ flex: 1 }}>
                        <button type="button" style={{ width: '100%', background: '#555' }}>Anuluj</button>
                    </Link>
                </div>
            </form>
        </div>
    );
};

export default BookFormPage;
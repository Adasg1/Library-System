import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router';
import { bookService } from '../services/bookService';
import { categoryService } from '../services/categoryService';
import { AddCircleOutline, Save, Cancel, AutoStories } from '@mui/icons-material';

const BookFormPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [categories, setCategories] = useState([]);
    const [newCatName, setNewCatName] = useState(''); // Stan dla nowej kategorii
    const [isAdding, setIsAdding] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        author: '',
        isbn: '',
        description: '',
        publisher: '',
        publishYear: new Date().getFullYear(),
        categoryIds: []
    });

    // Funkcja odświeżająca listę kategorii
    const refreshCategories = async () => {
        try {
            const allCats = await categoryService.getAllCategories();
            setCategories(allCats);
            return allCats;
        } catch (err) {
            console.error("Błąd ładowania kategorii:", err);
        }
    };

    useEffect(() => {
        const loadInitialData = async () => {
            const allCats = await refreshCategories();

            if (id) {
                try {
                    const book = await bookService.getFullBookById(id);
                    // Mapowanie nazw na ID dla selektora
                    const preselectedIds = allCats
                        .filter(cat => book.categoryNames && book.categoryNames.includes(cat.categoryName))
                        .map(cat => cat.categoryId);

                    setFormData({
                        title: book.title || '',
                        author: book.author || '',
                        isbn: book.isbn || '',
                        description: book.description || '',
                        publisher: book.publisher || '',
                        publishYear: book.publishYear || new Date().getFullYear(),
                        categoryIds: preselectedIds
                    });
                } catch (err) {
                    console.error("Błąd ładowania książki:", err);
                }
            }
        };
        loadInitialData();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCategoryChange = (e) => {
        const selectedValues = Array.from(e.target.selectedOptions, option => parseInt(option.value));
        setFormData(prev => ({ ...prev, categoryIds: selectedValues }));
    };

    // Obsługa dodawania nowej kategorii do bazy danych
    const handleAddCategory = async () => {
        if (!newCatName.trim()) return;
        setIsAdding(true);
        try {
            const created = await categoryService.addCategory({ categoryName: newCatName });
            const updatedCats = await refreshCategories();

            // Automatyczne zaznaczenie nowej kategorii
            setFormData(prev => ({
                ...prev,
                categoryIds: [...prev.categoryIds, created.categoryId]
            }));
            setNewCatName('');
        } catch (err) {
            alert("Błąd: Kategoria może już istnieć lub wystąpił problem z serwerem.");
        } finally {
            setIsAdding(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Przygotowanie payloadu zgodnie z wymaganiami backendu (lista nazw kategorii)
        const selectedCategoryNames = categories
            .filter(cat => formData.categoryIds.includes(cat.categoryId))
            .map(cat => cat.categoryName);

        const payload = {
            ...formData,
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
            alert("Błąd zapisu. Upewnij się, że wszystkie pola są poprawne.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-12 flex justify-center">
            <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
                {/* Header */}
                <div className="bg-[#646cff] p-8 text-white flex items-center justify-center gap-3">
                    <AutoStories fontSize="large" />
                    <h2 className="text-3xl font-bold">{id ? 'Edytuj Książkę' : 'Dodaj Nową Książkę'}</h2>
                </div>

                <form onSubmit={handleSubmit} className="p-10 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Tytuł */}
                        <div className="flex flex-col">
                            <label className="text-sm font-bold text-gray-600 uppercase mb-2">Tytuł</label>
                            <input name="title" value={formData.title} onChange={handleChange} className="border-2 border-gray-100 p-3 rounded-xl focus:border-[#646cff] outline-none transition-all" required />
                        </div>
                        {/* Autor */}
                        <div className="flex flex-col">
                            <label className="text-sm font-bold text-gray-600 uppercase mb-2">Autor</label>
                            <input name="author" value={formData.author} onChange={handleChange} className="border-2 border-gray-100 p-3 rounded-xl focus:border-[#646cff] outline-none transition-all" required />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* ISBN */}
                        <div className="flex flex-col col-span-1">
                            <label className="text-sm font-bold text-gray-600 uppercase mb-2">ISBN</label>
                            <input name="isbn" value={formData.isbn} onChange={handleChange} className="border-2 border-gray-100 p-3 rounded-xl focus:border-[#646cff] outline-none transition-all" required />
                        </div>
                        {/* Wydawnictwo */}
                        <div className="flex flex-col col-span-1">
                            <label className="text-sm font-bold text-gray-600 uppercase mb-2">Wydawnictwo</label>
                            <input name="publisher" value={formData.publisher} onChange={handleChange} className="border-2 border-gray-100 p-3 rounded-xl focus:border-[#646cff] outline-none transition-all" required />
                        </div>
                        {/* Rok Wydania */}
                        <div className="flex flex-col col-span-1">
                            <label className="text-sm font-bold text-gray-600 uppercase mb-2">Rok wydania</label>
                            <input name="publishYear" type="number" value={formData.publishYear} onChange={handleChange} className="border-2 border-gray-100 p-3 rounded-xl focus:border-[#646cff] outline-none transition-all" required />
                        </div>
                    </div>

                    {/* Opis */}
                    <div className="flex flex-col">
                        <label className="text-sm font-bold text-gray-600 uppercase mb-2">Opis książki</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} rows="3" className="border-2 border-gray-100 p-3 rounded-xl focus:border-[#646cff] outline-none transition-all resize-none" />
                    </div>

                    {/* Kategorie */}
                    <div className="pt-4 border-t border-gray-100">
                        <label className="text-sm font-bold text-gray-600 uppercase mb-2 block">Kategorie (Ctrl + klik aby wybrać kilka)</label>
                        <select
                            multiple
                            name="categoryIds"
                            value={formData.categoryIds}
                            onChange={handleCategoryChange}
                            className="w-full h-40 border-2 border-gray-100 p-3 rounded-xl bg-gray-50 focus:ring-2 focus:ring-[#646cff] outline-none mb-4"
                        >
                            {categories.map(cat => (
                                <option key={cat.categoryId} value={cat.categoryId} className="p-1">
                                    {cat.categoryName}
                                </option>
                            ))}
                        </select>

                        {/* Panel szybkiego dodawania kategorii */}
                        <div className="bg-indigo-50 p-4 rounded-2xl flex flex-col sm:flex-row gap-3 items-end border border-indigo-100">
                            <div className="flex-1 w-full">
                                <label className="text-xs font-bold text-[#646cff] uppercase mb-2 block">Brakuje kategorii? Dodaj ją:</label>
                                <input
                                    placeholder="Wpisz nazwę nowej kategorii..."
                                    className="w-full p-2.5 rounded-xl border-2 border-white focus:border-[#646cff] outline-none transition-all shadow-sm"
                                    value={newCatName}
                                    onChange={(e) => setNewCatName(e.target.value)}
                                />
                            </div>
                            <button
                                type="button"
                                onClick={handleAddCategory}
                                disabled={isAdding || !newCatName}
                                className="bg-[#646cff] text-white px-6 py-2.5 rounded-xl hover:bg-[#535bf2] transition-all flex items-center gap-2 font-bold shadow-lg shadow-indigo-100 disabled:opacity-50"
                            >
                                <AddCircleOutline />
                                {isAdding ? 'Dodawanie...' : 'Dodaj'}
                            </button>
                        </div>
                    </div>

                    {/* Akcje końcowe */}
                    <div className="flex gap-4 pt-8">
                        <button type="submit" className="flex-1 bg-green-500 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-green-600 shadow-xl shadow-green-100 transition-all text-lg">
                            <Save /> Zapisz Książkę
                        </button>
                        <Link to="/books" className="flex-1">
                            <button type="button" className="w-full bg-gray-100 text-gray-600 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-gray-200 transition-all text-lg">
                                <Cancel /> Anuluj
                            </button>
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BookFormPage;
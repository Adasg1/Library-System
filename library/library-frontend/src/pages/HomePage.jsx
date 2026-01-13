import React from 'react';
import { Link } from 'react-router';
import { useAuth } from "../context/AuthContext.jsx";
import {
    BookOutlined,
    AccountCircleOutlined,
    AddBoxOutlined,
    PeopleAltOutlined,
    LibraryBooks
} from '@mui/icons-material';

const HomePage = () => {
    const { user } = useAuth();
    const isStaff = user?.role === 'ADMIN' || user?.role === 'LIBRARIAN';

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 p-6 md:p-12">
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

            <div className="max-w-6xl mx-auto">
                {user ? (
                    <div className="space-y-8">
                        {/* Powitanie */}
                        <div className="bg-white border border-gray-200 p-8 rounded-2xl shadow-sm">
                            <h2 className="text-2xl font-bold">
                                Witaj z powrotem, <span className="text-[#646cff]">{user.firstName || 'Użytkowniku'}</span>! 👋
                            </h2>
                            <p className="text-gray-500 mt-1">Cieszymy się, że znowu jesteś z nami.</p>
                        </div>

                        {/* Grid z kafelkami */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Katalog */}
                            <Link to="/books" className="group bg-white p-6 rounded-xl border border-gray-200 hover:border-[#646cff] transition-all duration-300 shadow-sm hover:shadow-md">
                                <div className="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center mb-4 group-hover:bg-[#646cff]/10">
                                    <BookOutlined className="text-[#646cff]" />
                                </div>
                                <h3 className="text-xl font-bold mb-2 group-hover:text-[#646cff]">Przeglądaj katalog</h3>
                                <p className="text-gray-500 text-sm leading-relaxed">Znajdź swoją kolejną ulubioną lekturę wśród tysięcy dostępnych pozycji.</p>
                            </Link>

                            {/* Profil */}
                            <Link to="/profile" className="group bg-white p-6 rounded-xl border border-gray-200 hover:border-[#646cff] transition-all duration-300 shadow-sm hover:shadow-md">
                                <div className="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center mb-4 group-hover:bg-[#646cff]/10">
                                    <AccountCircleOutlined className="text-[#646cff]" />
                                </div>
                                <h3 className="text-xl font-bold mb-2 group-hover:text-[#646cff]">Mój profil</h3>
                                <p className="text-gray-500 text-sm leading-relaxed">Sprawdź status swoich wypożyczeń i edytuj dane profilowe.</p>
                            </Link>

                            {/* Sekcja Staff / Admin */}
                            {isStaff && (
                                <Link to="/books/new" className="group bg-white p-6 rounded-xl border border-orange-100 hover:border-orange-400 transition-all duration-300 shadow-sm hover:shadow-md">
                                    <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center mb-4 group-hover:bg-orange-100">
                                        <AddBoxOutlined className="text-orange-600" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-2 group-hover:text-orange-600">Dodaj Książkę</h3>
                                    <p className="text-gray-500 text-sm leading-relaxed">Narzędzie dla personelu: wprowadź nową dostawę do systemu.</p>
                                </Link>
                            )}

                            {user?.role === 'ADMIN' && (
                                <Link to="/admin/users" className="group bg-white p-6 rounded-xl border border-red-100 hover:border-red-400 transition-all duration-300 shadow-sm hover:shadow-md">
                                    <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center mb-4 group-hover:bg-red-100">
                                        <PeopleAltOutlined className="text-red-600" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-2 group-hover:text-red-600">Użytkownicy</h3>
                                    <p className="text-gray-500 text-sm leading-relaxed">Administracja: zarządzaj uprawnieniami i kontami czytelników.</p>
                                </Link>
                            )}
                        </div>
                    </div>
                ) : (
                    /* Widok dla niezalogowanego */
                    <div className="bg-white border border-gray-200 p-12 rounded-3xl text-center shadow-xl max-w-3xl mx-auto">
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
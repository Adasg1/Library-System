import React, { useEffect, useState } from 'react';
import { userService } from "../services/userService.js";
import { toast } from 'react-toastify';
import { Delete, AdminPanelSettings, Person, School, SupervisorAccount } from '@mui/icons-material';

const AdminPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            const data = await userService.getUsers();
            setUsers(data);
        } catch (err) {
            console.error("Błąd pobierania użytkowników", error);
            toast.error("Nie udało się pobrać listy użytkowników.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (userId) => {
        if(!window.confirm("Na pewno usunąć użytkownika?")) return;
        try {
            await userService.deleteUser(userId);
            toast.success("Użytkownik został usunięty.");
            loadUsers();
        } catch (err) {
            console.error("Błąd usuwania", error);
            toast.error("Wystąpił błąd podczas usuwania użytkownika.");
        }
    };

    const handleRoleChange = async (userId, newRole) => {
        try {
            await userService.updateUser(userId, { role: newRole });
            toast.success(`Zmieniono rolę użytkownika na ${newRole}`);
            loadUsers();
        } catch (err) {
            console.error("Błąd zmiany roli", error);
            toast.error("Nie udało się zmienić roli użytkownika.");
        }
    };

    // Helper do wyświetlania ładnej nazwy roli
    const getRoleBadgeColor = (role) => {
        switch (role) {
            case 'ADMIN': return 'bg-purple-100 text-purple-700 border-purple-200';
            case 'LIBRARIAN': return 'bg-blue-100 text-blue-700 border-blue-200';
            default: return 'bg-gray-100 text-gray-600 border-gray-200';
        }
    };

    const getRoleIcon = (role) => {
        switch (role) {
            case 'ADMIN': return <AdminPanelSettings fontSize="small" className="mr-1"/>;
            case 'LIBRARIAN': return <School fontSize="small" className="mr-1"/>;
            default: return <Person fontSize="small" className="mr-1"/>;
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-gray-500">Ładowanie użytkowników...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-12">
            <div className="max-w-6xl mx-auto">

                {/* --- NAGŁÓWEK --- */}
                <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900">Panel Administratora</h1>
                        <p className="text-gray-500 mt-1">Zarządzaj użytkownikami i ich uprawnieniami.</p>
                    </div>
                    <div className="bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm text-sm font-medium text-gray-600 flex items-center gap-2">
                        <SupervisorAccount color="action" />
                        Liczba użytkowników: <span className="font-bold text-gray-900">{users.length}</span>
                    </div>
                </div>

                {/* --- TABELA UŻYTKOWNIKÓW --- */}
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Użytkownik</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Rola (Uprawnienia)</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Akcje</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                            {users.map((user) => {
                                const userId = user.id || user.userId;
                                return (
                                    <tr key={userId} className="hover:bg-gray-50 transition-colors group">

                                        {/* Kolumna: Użytkownik */}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm uppercase">
                                                    {user.firstName ? user.firstName[0] : user.email[0]}
                                                    {user.lastName ? user.lastName[0] : ''}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {user.firstName} {user.lastName}
                                                    </div>
                                                    <div className="text-xs text-gray-400 md:hidden">
                                                        {user.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Kolumna: Email */}
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {user.email}
                                        </td>

                                        {/* Kolumna: Zmiana Roli */}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                {/* Badge pokazujący obecną rolę wizualnie */}
                                                <div className={`hidden md:flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRoleBadgeColor(user.role)}`}>
                                                    {getRoleIcon(user.role)}
                                                    {user.role}
                                                </div>

                                                {/* Select do zmiany */}
                                                <select
                                                    value={user.role}
                                                    onChange={(e) => handleRoleChange(userId, e.target.value)}
                                                    className="block w-32 md:w-40 pl-3 pr-8 py-1.5 text-sm border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md border bg-white shadow-sm cursor-pointer hover:border-gray-400 transition-colors"
                                                >
                                                    <option value="READER">Czytelnik</option>
                                                    <option value="LIBRARIAN">Bibliotekarz</option>
                                                    <option value="ADMIN">Admin</option>
                                                </select>
                                            </div>
                                        </td>

                                        {/* Kolumna: Akcje */}
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={() => handleDelete(userId)}
                                                className="text-red-400 hover:text-red-600 transition-colors p-2 rounded-full hover:bg-red-50"
                                                title="Usuń użytkownika"
                                            >
                                                <Delete fontSize="small" />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                            </tbody>
                        </table>
                    </div>

                    {/* Empty state */}
                    {users.length === 0 && (
                        <div className="p-12 text-center text-gray-500">
                            Brak użytkowników w systemie.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminPage;
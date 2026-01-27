import React, { useEffect, useState } from 'react';
import { opinionService } from "../services/opinionService.js";
import { Link } from "react-router";
import { Message, Delete, ThumbUp, ThumbDown, LibraryBooks } from '@mui/icons-material';
import { toast } from "react-toastify";

const UserOpinions = ({ userId }) => {
    const [opinions, setOpinions] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadOpinions = async () => {
        try {
            const data = await opinionService.getMyOpinions();
            setOpinions(data);
        } catch (error) {
            console.error("Błąd pobierania opinii użytkownika:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (userId) loadOpinions();
    }, [userId]);

    const handleDelete = async (opinionId) => {
        if (window.confirm('Czy na pewno chcesz usunąć tę opinię?')) {
            try {
                await opinionService.deleteOpinion(opinionId);
                toast.success("Opinia została usunięta.");
                loadOpinions(); // Odśwież listę
            } catch (error) {
                toast.error("Nie udało się usunąć opinii.");
            }
        }
    };

    if (loading) return <div className="p-4 text-center text-gray-500 text-sm italic">Ładowanie opinii...</div>;

    return (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-8">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-indigo-50 text-[#646cff] rounded-lg">
                    <Message />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Twoje opinie ({opinions.length})</h2>
            </div>

            {opinions.length === 0 ? (
                <div className="py-10 text-center border-2 border-dashed border-gray-100 rounded-2xl text-gray-400">
                    Nie napisałeś jeszcze żadnej opinii.
                </div>
            ) : (
                <div className="space-y-4">
                    {opinions.map(op => (
                        <div key={op.opinionId} className="group p-5 bg-gray-50 rounded-2xl border border-gray-100 hover:border-indigo-100 transition-all">
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center gap-2">
                                    <LibraryBooks className="text-gray-400" fontSize="small" />
                                    <Link
                                        to={`/books/details/${op.bookId}`}
                                        className="font-bold text-[#646cff] hover:underline text-sm uppercase tracking-wide"
                                    >
                                        Książka: {op.bookTitle}
                                    </Link>
                                </div>
                                <button
                                    onClick={() => handleDelete(op.opinionId)}
                                    className="text-gray-400 hover:text-red-500 transition-colors p-1"
                                >
                                    <Delete fontSize="small" />
                                </button>
                            </div>

                            <p className="text-gray-700 italic leading-relaxed mb-4 text-sm">
                                "{op.content}"
                            </p>

                            <div className="flex items-center gap-4 text-xs font-bold text-gray-400">
                                <div className="flex items-center gap-1">
                                    <ThumbUp fontSize="inherit" /> {op.likes}
                                </div>
                                <div className="flex items-center gap-1">
                                    <ThumbDown fontSize="inherit" /> {op.dislikes}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default UserOpinions;
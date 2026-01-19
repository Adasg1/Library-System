import React, { useEffect, useState, useMemo } from 'react';
import { opinionService } from "../services/opinionService.js";
import { Message, Send, ThumbUp, ThumbDown, Delete, Edit, Save, Close, ExpandMore, ExpandLess } from '@mui/icons-material';
import { toast } from "react-toastify";

const BookOpinions = ({ bookId, user }) => {
    const [opinions, setOpinions] = useState([]);
    const [content, setContent] = useState("");

    const [visibleCount, setVisibleCount] = useState(3);

    const [editingId, setEditingId] = useState(null);
    const [editContent, setEditContent] = useState("");

    const loadOpinions = async () => {
        try {
            const data = await opinionService.getOpinionsByBookId(bookId);
            setOpinions(data);
        } catch (error) {
            console.error("Błąd ładowania opinii", error);
        }
    };

    useEffect(() => {
        if (bookId) {
            loadOpinions();
            setVisibleCount(3);
        }
    }, [bookId]);

    const sortedOpinions = useMemo(() => {
        return [...opinions].sort((a, b) => (b.likes - b.dislikes) - (a.likes - a.dislikes));
    }, [opinions]);

    const displayedOpinions = sortedOpinions.slice(0, visibleCount);

    const handleLoadMore = () => {
        setVisibleCount(prev => prev + 3);
    };

    const handleCollapse = () => {
        setVisibleCount(3);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await opinionService.createOpinion(bookId, content);
            setContent("");
            loadOpinions();
            toast.success("Dodano opinię!");
        } catch (error) {
            if (error.response?.status === 409) toast.error("Już oceniłeś tę książkę.");
            else toast.error("Nie udało się dodać opinii.");
        }
    };

    const handleUpdate = async (id) => {
        if (!editContent.trim()) return;
        try {
            await opinionService.updateOpinion(id, editContent);
            setEditingId(null);
            loadOpinions();
            toast.success("Opinia zaktualizowana.");
        } catch (error) { toast.error("Błąd aktualizacji."); }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Usunąć opinię?")) {
            await opinionService.deleteOpinion(id);
            loadOpinions();
        }
    };

    const handleReaction = async (opinionId, clickedType, currentType) => {
        if (!user) return toast.info("Zaloguj się, aby oceniać.");

        const newReaction = clickedType === currentType ? 'NONE' : clickedType;

        try {
            await opinionService.reactToOpinion(opinionId, newReaction);
            loadOpinions();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="mt-12 border-t border-gray-200 pt-10">
            <div className="flex items-center gap-2 mb-8">
                <Message className="text-indigo-500" />
                <h2 className="text-2xl font-bold text-gray-800">Opinie ({opinions.length})</h2>
            </div>

            {/* Formularz dodawania */}
            {user ? (
                <form onSubmit={handleSubmit} className="mb-10 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <textarea
                        className="w-full p-4 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                        rows="3"
                        placeholder="Twoja opinia..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                    />
                    <div className="flex justify-end mt-3">
                        <button type="submit" className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-indigo-700 transition-colors">
                            <Send fontSize="small"/> Wyślij
                        </button>
                    </div>
                </form>
            ) : (
                <p className="text-center text-gray-500 mb-8 italic">Zaloguj się, aby dodać opinię.</p>
            )}

            {/* Lista wyświetlanych opinii */}
            <div className="space-y-6">
                {displayedOpinions.map(op => (
                    <div key={op.opinionId} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm animate-fadeIn">
                        <div className="flex justify-between mb-2">
                            <span className="font-bold text-gray-800">{op.nick}</span>
                            {(Number(user?.id) === Number(op.userId) || user?.role === 'ADMIN') && (
                                <div className="flex gap-2 text-gray-400">
                                    {editingId !== op.opinionId ? (
                                        <>
                                            <button onClick={() => {setEditingId(op.opinionId); setEditContent(op.content);}} className="hover:text-indigo-600"><Edit fontSize="small" /></button>
                                            <button onClick={() => handleDelete(op.opinionId)} className="hover:text-red-600"><Delete fontSize="small" /></button>
                                        </>
                                    ) : (
                                        <>
                                            <button onClick={() => handleUpdate(op.opinionId)} className="text-green-600"><Save fontSize="small" /></button>
                                            <button onClick={() => setEditingId(null)}><Close fontSize="small" /></button>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>

                        {editingId === op.opinionId ? (
                            <textarea
                                className="w-full p-3 border border-indigo-100 rounded-lg bg-indigo-50 mb-4 outline-none"
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                autoFocus
                            />
                        ) : (
                            <p className="text-gray-600 mb-4 whitespace-pre-line">{op.content}</p>
                        )}

                        <div className="flex gap-4">
                            <button
                                onClick={() => handleReaction(op.opinionId, 'LIKE', op.userReaction)}
                                className={`flex items-center gap-1 transition-colors ${
                                    op.userReaction === 'LIKE' ? 'text-blue-600 font-bold' : 'text-gray-500 hover:text-blue-600'
                                }`}
                            >
                                <ThumbUp fontSize="small" /> <span>{op.likes}</span>
                            </button>

                            <button
                                onClick={() => handleReaction(op.opinionId, 'DISLIKE', op.userReaction)}
                                className={`flex items-center gap-1 transition-colors ${
                                    op.userReaction === 'DISLIKE' ? 'text-red-600 font-bold' : 'text-gray-500 hover:text-red-600'
                                }`}
                            >
                                <ThumbDown fontSize="small" /> <span>{op.dislikes}</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-8">
                {/* Przycisk "Pokaż kolejne" - widoczny, gdy są jeszcze ukryte opinie */}
                {visibleCount < opinions.length && (
                    <button
                        onClick={handleLoadMore}
                        className="flex-1 py-3 flex items-center justify-center gap-2 text-indigo-600 font-bold hover:bg-indigo-50 border border-dashed border-indigo-200 rounded-xl transition-all"
                    >
                        <ExpandMore /> Pokaż kolejne opinie (zostało {opinions.length - visibleCount})
                    </button>
                )}

                {/* Przycisk "Zwiń" - widoczny, gdy wyświetlamy więcej niż pierwotne 3 opinie */}
                {visibleCount > 3 && (
                    <button
                        onClick={handleCollapse}
                        className="flex-1 py-3 flex items-center justify-center gap-2 text-gray-500 font-bold hover:bg-gray-100 border border-gray-200 rounded-xl transition-all"
                    >
                        <ExpandLess /> Zwiń do góry
                    </button>
                )}
            </div>
        </div>
    );
};

export default BookOpinions;
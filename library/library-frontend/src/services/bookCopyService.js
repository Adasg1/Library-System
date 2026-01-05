import api from "./api";

export const bookCopyService = {
    // Kopie dla danej książki
    async getCopiesByBookId(bookId) {
        const response = await api.get(`/bookcopy/book/${bookId}`);
        return response.data;
    },

    // Dodawanie kopii książki
    async addCopy(bookId, status = "AVAILABLE") {
        const response = await api.post(`/bookcopy/add/${bookId}`, null, {params: { status }});
        return response.data;
    },

    // Usuwanie kopii książki
    async deleteBook(copyId) {
        await api.delete(`/bookcopy/${copyId}`);
    }
};
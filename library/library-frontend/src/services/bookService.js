import api from "./api";

export const bookService = {
    // Dla wszystkich
    async getAllBooksFull() {
        const response = await api.get("/book/full");
        return response.data;
    },

    async getAllBooksBrief(sort="title") {
        const response = await api.get("/book/brief", {params: { sort }});
        return response.data;
    },

    async getFullBookById(bookId) {
        const response = await api.get(`/book/full/${bookId}`);
        return response.data;
    },

    async getBriefBookById(bookId) {
        const response = await api.get(`/book/brief/${bookId}`);
        return response.data;
    },

    async getBooksByCategory(categoryId, sort="title") {
        const response = await api.get(`/book/category/${categoryId}`, {params: {sort}});
        return response.data;
    },

    async getRelatedBooks(bookId) {
        const response = await api.get(`/book/related/${bookId}`);
        return response.data;
    },

    // Dla Admina/Pracownika

    // Tworzenie książki
    async createBook(bookData) {
        const response = await api.post(`/book/add`, bookData);
        return response.data;
    },

    // Update-owanie danych książki
    async updateBook(bookId, bookData) {
        const response = await api.put(`/book/${bookId}`, bookData);
        return response.data;
    },

    // Usuwanie książki
    async deleteBook(bookId) {
        await api.delete(`/book/${bookId}`);
    },

    // Statystyki
    async getNewestBooks() {
        const response = await api.get("/book/newest");
        return response.data;
    },

    async getPopularBooks(limit = 4) {
        const response = await api.get("/book/popular", {params: {limit}});
        return response.data;
    }

};
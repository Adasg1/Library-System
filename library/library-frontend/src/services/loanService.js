import api from "./api";

export const loanService = {
    // Wypożyczanie książki
    async rentBook(userId, copyId) {
        const response = await api.post("/loan/rent", null, {params: { userId, copyId }});
        return response.data;
    },

    // Zwracanie książki
    async returnBook(loanId) {
        const response = await api.post(`/loan/return/${loanId}`);
        return response.data;
    },

    // Pobieranie wypożyczeń użytkownika
    async getUserLoans(userId) {
        const response = await api.get(`/loan/user/${userId}`);
        return response.data;
    },

    // Pobieranie wypożyczeń użytkownika (nie jako admin)
    async getMyLoans() {
        const response = await api.get("/loan/me");
        return response.data;
    },

    // Przedłużanie wypożyczenia
    async prolongLoan(loanId){
        const response = await api.post(`/loan/prolong/${loanId}`);
        return response.data;
    },

    async getAllActiveLoans() {
        const response = await api.get(`/loan/active`);
        return response.data;
    }
};
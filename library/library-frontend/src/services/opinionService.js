import api from "./api";

export const opinionService = {
    async getOpinionsByBookId(bookId) {
        const response = await api.get(`/opinion?bookId=${bookId}`); // Zmieniono z /opinion/bookId/${bookId}
        return response.data;
    },

    async getMyOpinions() {
        const response = await api.get("/opinion/my");
        return response.data;
    },

    async createOpinion(bookId, content) {
        const response = await api.post("/opinion", { bookId, content });
        return response.data;
    },

    async updateOpinion(opinionId, content) {
        const response = await api.patch(`/opinion/${opinionId}`, { content });
        return response.data;
    },

    async deleteOpinion(opinionId) {
        await api.delete(`/opinion/${opinionId}`);
    },

    async reactToOpinion(opinionId, reaction) {
        const response = await api.post(`/opinion-reaction/${opinionId}?reaction=${reaction}`);
        return response.data;
    }
};
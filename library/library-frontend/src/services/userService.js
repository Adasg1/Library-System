import api from "./api";

export const userService = {
    async getUsers() {
        try {
            const response = await api.get("/user");
            return response.data;
        } catch (error) {
            console.error(error);
            return [];
        }
    },

    async getUserById(id) {
        const response = await api.get(`/user/${id}`);
        return response.data;
    },

    async updateUser(id, userData) {
        const response = await api.put(`/user/${id}`, userData);
        return response.data;
    },

    async deleteUser(id) {
        await api.delete(`/user/${id}`);
    }
};
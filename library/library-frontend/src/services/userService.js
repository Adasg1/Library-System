import api from "./api";

export const userService = {
    async getUsers() {
        try {
            const response = await api.get("/users");
            return response.data;
        } catch (error) {
            console.error(error);
            return [];
        }
    },

    async getUserById(id) {
        const response = await api.get(`/users/${id}`);
        return response.data;
    },

    async updateUser(id, userData) {
        const response = await api.put(`/users/${id}`, userData);
        return response.data;
    },

    async deleteUser(id) {
        await api.delete(`/users/${id}`);
    }
};
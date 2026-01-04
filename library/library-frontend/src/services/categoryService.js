import api from "./api";

export const categoryService = {
    async getAllCategories() {
        const response = await api.get("/category");
        return response.data;
    },

    async getCategoryById(id) {
        const response = await api.get(`/category/${id}`);
        return response.data;
    },

    // Admin/Librarian
    async updateCategory(id, categoryData) {
        const response = await api.put(`/category/${id}`, categoryData);
        return response.data;
    },

    async deleteCategory(id) {
        const response = await api.delete(`/category/${id}`);
        return response.data;
    }
};
import api from "./api";

export const reservationService = {
    async createReservation(requestData) {
        const response = await api.post("/reservation", requestData);
        return response.data;
    },

    async cancelReservation(reservationId) {
        const response = await api.patch(`/reservation/${reservationId}`);
        return response.data;
    },

    async getUserReservations(userId){
        const response = await api.get(`/reservation/user/${userId}`);
        return response.data;
    },

    async getMyReservations(){
        const response = await api.get(`/reservation/me`);
        return response.data;
    },
}
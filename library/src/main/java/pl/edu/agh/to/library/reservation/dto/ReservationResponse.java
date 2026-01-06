package pl.edu.agh.to.library.reservation.dto;

import pl.edu.agh.to.library.reservation.Reservation;
import pl.edu.agh.to.library.reservation.ReservationStatus;

import java.time.LocalDateTime;

public record ReservationResponse(
        Integer reservationId,
        LocalDateTime reservationDate,
        LocalDateTime maxPickupDate,
        ReservationStatus status

) {
    public static ReservationResponse from(Reservation reservation) {
        return new ReservationResponse(
                reservation.getReservationId(),
                reservation.getReservationDate(),
                reservation.getMaxPickupDate(),
                reservation.getStatus()
        );
    }
}

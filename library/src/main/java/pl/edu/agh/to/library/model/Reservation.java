package pl.edu.agh.to.library.model;

import pl.edu.agh.to.library.model.enums.ReservationStatus;

import java.time.LocalDateTime;

public class Reservation {

    private int reservationId;

    private LocalDateTime reservationDate;

    private LocalDateTime maxPickupDate;

    private ReservationStatus status;

    private User user;

    private Book book;
}

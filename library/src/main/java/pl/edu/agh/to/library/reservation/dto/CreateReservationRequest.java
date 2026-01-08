package pl.edu.agh.to.library.reservation.dto;

import java.time.LocalDateTime;

public record CreateReservationRequest(
        int bookId
) {}
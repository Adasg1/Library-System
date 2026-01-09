package pl.edu.agh.to.library.reservation.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;


public record CreateReservationRequest(
        @NotNull @Positive Integer bookId
) {}
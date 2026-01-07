package pl.edu.agh.to.library.reservation;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import pl.edu.agh.to.library.reservation.dto.CreateReservationRequest;
import pl.edu.agh.to.library.reservation.dto.ReservationResponse;
import pl.edu.agh.to.library.user.User;

import java.util.List;

@RestController
@RequestMapping("/api/reservation")
public class ReservationController {

    private final ReservationService reservationService;


    public ReservationController(ReservationService reservationService) {
        this.reservationService = reservationService;
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ReservationResponse> createReservation(
            @AuthenticationPrincipal User user,
            @RequestBody CreateReservationRequest request
    ) {
        var reservation = reservationService.createReservation(user, request.bookId(), request.date());
        return ResponseEntity.ok(ReservationResponse.from(reservation));
    }

    @PatchMapping("/{reservationId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ReservationResponse> cancelReservation(
            @AuthenticationPrincipal User user,
            @PathVariable int reservationId
    ) {
        var reservation = reservationService.cancelReservation(
                user.getUserId(), reservationId
        );
        return ResponseEntity.ok(ReservationResponse.from(reservation));
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasAnyRole('ADMIN','LIBRARIAN')")
    public ResponseEntity<List<ReservationResponse>> getUserReservations(
        @PathVariable int userId
    ) {
        return ResponseEntity.ok(reservationService.getUserReservations(userId));
    }

    @GetMapping("/book/{bookId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'LIBRARIAN')")
    public ResponseEntity<List<ReservationResponse>> getBookReservations(
            @PathVariable int bookId
    ) {
        var reservations = reservationService.getBookReservations(bookId);
        return ResponseEntity.ok(
                reservations.stream()
                        .map(ReservationResponse::from)
                        .toList()
        );
    }

    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<ReservationResponse>> getMyReservations(
        @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(reservationService.getUserReservations(user.getUserId()));
    }

}

package pl.edu.agh.to.library.loan;

import jakarta.persistence.*;
import pl.edu.agh.to.library.book.Book;
import pl.edu.agh.to.library.user.User;

import java.time.LocalDateTime;

@Entity
@Table(name="Reservations")
public class Reservation {

    @Id
    @GeneratedValue
    private int reservationId;

    private LocalDateTime reservationDate;

    private LocalDateTime maxPickupDate;

    private ReservationStatus status;

    @ManyToOne
    @JoinColumn(name = "userId")
    private User user;

    @ManyToOne
    @JoinColumn(name = "bookId")
    private Book book;
}

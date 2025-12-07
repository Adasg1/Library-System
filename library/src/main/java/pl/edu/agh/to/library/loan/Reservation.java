package pl.edu.agh.to.library.loan;

import jakarta.persistence.*;
import pl.edu.agh.to.library.book.Book;
import pl.edu.agh.to.library.book.BookCopy;
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

    public Reservation(User user, Book book, LocalDateTime reservationDate, ReservationStatus status){
        this.user = user;
        this.book = book;
        this.reservationDate = reservationDate;
        this.status = status;
    }

    //region getters-setters
    public int getReservationId() {
        return reservationId;
    }

    public User getUser() {
        return user;
    }

    public Book getBook() {
        return book;
    }

    public ReservationStatus getStatus() {
        return status;
    }

    public void setStatus(ReservationStatus status) {
        this.status = status;
    }

    public LocalDateTime getReservationDate() {
        return reservationDate;
    }

    public LocalDateTime getMaxPickupDate() {
        return maxPickupDate;
    }

    public void setMaxPickupDate(LocalDateTime maxPickupDate) {
        this.maxPickupDate = maxPickupDate;
    }
    //endregion
}

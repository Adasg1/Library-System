package pl.edu.agh.to.library.reservation;

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

    @ManyToOne
    @JoinColumn(name = "bookCopyId", nullable = false)
    private BookCopy assignedCopy;

    public Reservation(User user, Book book, LocalDateTime reservationDate){
        this.user = user;
        this.book = book;
        this.reservationDate = reservationDate;
        this.maxPickupDate = reservationDate.plusDays(4);
        this.status = ReservationStatus.WAITING;
    }

    public Reservation() {

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

    public BookCopy getAssignedCopy() {return assignedCopy;}

    public void setAssignedCopy(BookCopy copy) {this.assignedCopy = copy;}

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

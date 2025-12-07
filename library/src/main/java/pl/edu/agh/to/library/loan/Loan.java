package pl.edu.agh.to.library.loan;

import jakarta.persistence.*;
import pl.edu.agh.to.library.book.BookCopy;
import pl.edu.agh.to.library.user.User;

import java.time.LocalDateTime;

@Entity
@Table(name="Loans")
public class Loan {

    @Id
    @GeneratedValue
    private int loanId;

    @ManyToOne
    @JoinColumn(name = "userId")
    private User user;

    @ManyToOne
    @JoinColumn(name = "bookCopyId")
    private BookCopy bookCopy;

    private LoanStatus status;

    private LocalDateTime rentalDate;

    private LocalDateTime dueDate;

    private LocalDateTime returnDate;

    public Loan(User user, BookCopy bookCopy, LocalDateTime rentalDate, LocalDateTime dueDate){
        this.user = user;
        this.bookCopy = bookCopy;
        this.rentalDate = rentalDate;
        this.dueDate = dueDate;
    }

    //region getters-setters
    public int getLoanId() {
        return loanId;
    }

    public User getUser() {
        return user;
    }

    public BookCopy getBookCopy() {
        return bookCopy;
    }

    public LoanStatus getStatus() {
        return status;
    }

    public void setStatus(LoanStatus status) {
        this.status = status;
    }

    public LocalDateTime getRentalDate() {
        return rentalDate;
    }

    public LocalDateTime getDueDate() {
        return dueDate;
    }

    public void setDueDate(LocalDateTime dueDate) {
        this.dueDate = dueDate;
    }

    public LocalDateTime getReturnDate() {
        return returnDate;
    }

    public void setReturnDate(LocalDateTime returnDate) {
        this.returnDate = returnDate;
    }
    //endregion
}

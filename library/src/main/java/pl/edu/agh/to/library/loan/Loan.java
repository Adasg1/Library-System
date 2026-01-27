package pl.edu.agh.to.library.loan;

import jakarta.persistence.*;
import pl.edu.agh.to.library.bookcopy.BookCopy;
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

    private Integer timesProlonged = 0;

    public Loan(User user, BookCopy bookCopy, LocalDateTime rentalDate, LocalDateTime dueDate){
        this.user = user;
        this.bookCopy = bookCopy;
        this.rentalDate = rentalDate;
        this.dueDate = dueDate;
    }

    public Loan() {
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

    public Integer getTimesProlonged() {
        return timesProlonged;
    }

    public void setTimesProlonged(Integer timesProlonged) {
        this.timesProlonged = timesProlonged;
    }
}

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
}

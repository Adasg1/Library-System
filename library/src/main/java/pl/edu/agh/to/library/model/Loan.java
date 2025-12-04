package pl.edu.agh.to.library.model;

import pl.edu.agh.to.library.model.enums.LoanStatus;

import java.time.LocalDateTime;

public class Loan {

    private int loanId;

    private User user;

    private BookCopy bookCopy;

    private LoanStatus status;

    private LocalDateTime rentalDate;

    private LocalDateTime dueDate;

    private LocalDateTime returnDate;
}

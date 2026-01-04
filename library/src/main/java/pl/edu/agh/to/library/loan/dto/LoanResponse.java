package pl.edu.agh.to.library.loan.dto;

import pl.edu.agh.to.library.loan.Loan;
import pl.edu.agh.to.library.loan.LoanStatus;

import java.time.LocalDateTime;

public record LoanResponse(
        int loanId,
        int userId,
        String userEmail,
        int bookCopyId,
        String bookTitle,
        LoanStatus status,
        LocalDateTime rentalDate,
        LocalDateTime dueDate,
        LocalDateTime returnDate
) {
    public static LoanResponse from(Loan loan) {
        return new LoanResponse(
                loan.getLoanId(),
                loan.getUser().getUserId(),
                loan.getUser().getUsername(),
                loan.getBookCopy().getBookCopyId(),
                loan.getBookCopy().getBook().getTitle(),
                loan.getStatus(),
                loan.getRentalDate(),
                loan.getDueDate(),
                loan.getReturnDate()
        );
    }
}

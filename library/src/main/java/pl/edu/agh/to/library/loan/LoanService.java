package pl.edu.agh.to.library.loan;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.edu.agh.to.library.book.Book;
import pl.edu.agh.to.library.book.BookCopy;
import pl.edu.agh.to.library.book.BookCopyService;
import pl.edu.agh.to.library.book.BookStatus;
import pl.edu.agh.to.library.loan.dto.LoanResponse;
import pl.edu.agh.to.library.reservation.ReservationService;
import pl.edu.agh.to.library.user.User;
import pl.edu.agh.to.library.user.UserRepository;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class LoanService {

    private final LoanRepository loanRepository;
    private final UserRepository userRepository;
    private final BookCopyService bookCopyService;
    private final ReservationService reservationService;

    public LoanService(LoanRepository loanRepository, UserRepository userRepository, BookCopyService bookCopyService, ReservationService reservationService) {
        this.loanRepository = loanRepository;
        this.userRepository = userRepository;
        this.bookCopyService = bookCopyService;
        this.reservationService = reservationService;
    }

    @Transactional
    public LoanResponse createLoan(int userId, int copyId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NullPointerException("User not found"));

        BookCopy copy = bookCopyService.getCopyEntityById(copyId);

        if (copy.getStatus() != BookStatus.AVAILABLE) {
            throw new IllegalStateException("Book copy is not available for loan");
        }

        Loan loan = new Loan(user, copy, LocalDateTime.now(), LocalDateTime.now().plusMinutes(3)); //tutaj do zmiany na plusDays(x)
        loan.setStatus(LoanStatus.ACTIVE);

        bookCopyService.updateStatus(copyId, BookStatus.LOANED);

        return LoanResponse.from(loanRepository.save(loan));
    }

    @Transactional
    public LoanResponse returnLoan(int loanId) {
        Loan loan = loanRepository.findById(loanId)
                .orElseThrow(() -> new NullPointerException("Loan not found"));

        loan.setStatus(LoanStatus.RETURNED);
        loan.setReturnDate(LocalDateTime.now());

        BookCopy copy = loan.getBookCopy();
        reservationService.redistributeBookCopy(copy);

        return LoanResponse.from(loanRepository.save(loan));
    }

    @Transactional
    public void updateOverdueLoans() {
        LocalDateTime now = LocalDateTime.now();
        List<Loan> overdueLoans = loanRepository.findByStatus(LoanStatus.ACTIVE).stream()
                .filter(loan -> loan.getDueDate().isBefore(now))
                .toList();

        for (Loan loan : overdueLoans) {
            loan.setStatus(LoanStatus.OVERDUE);
        }
        loanRepository.saveAll(overdueLoans);
    }

    public Loan getLoanEntityById(int loanId) {
        return loanRepository.findById(loanId)
                .orElseThrow(() -> new NullPointerException("Loan not found with id: " + loanId));
    }

    public LoanResponse getLoanById(int loanId) {
        Loan loan = getLoanEntityById(loanId);
        return LoanResponse.from(loan);
    }

    public List<LoanResponse> getAllLoans() {
        return loanRepository.findAll().stream().map(LoanResponse::from).toList();
    }

    public List<LoanResponse> getLoansByUser(int userId) {
        return loanRepository.findByUser_UserId(userId).stream().map(LoanResponse::from).toList();
    }
}
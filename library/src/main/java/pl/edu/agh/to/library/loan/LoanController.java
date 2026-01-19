package pl.edu.agh.to.library.loan;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import pl.edu.agh.to.library.loan.dto.LoanResponse;
import pl.edu.agh.to.library.user.User;

import java.util.List;

@RestController
@RequestMapping("/api/loan")
public class LoanController {

    private final LoanService loanService;

    public LoanController(LoanService loanService) {
        this.loanService = loanService;
    }

    @PostMapping("/rent")
    @PreAuthorize("hasAnyRole('ADMIN','LIBRARIAN')")
    public ResponseEntity<LoanResponse> rentBook(@RequestParam int userId, @RequestParam int copyId) {
        return ResponseEntity.status(201).body(loanService.createLoan(userId, copyId));
    }

    @PostMapping("/return/{loanId}")
    @PreAuthorize("hasAnyRole('ADMIN','LIBRARIAN')")
    public ResponseEntity<LoanResponse> returnBookByLoanId(@PathVariable int loanId) {
        return ResponseEntity.ok(loanService.returnLoan(loanId));
    }

    @PostMapping("/return/copy/{copyId}")
    @PreAuthorize("hasAnyRole('ADMIN','LIBRARIAN')")
    public ResponseEntity<LoanResponse> returnBookByCopyId(@PathVariable int copyId) {
        return ResponseEntity.ok(loanService.returnLoanByCopyId(copyId));
    }

    @PostMapping("/prolong/{loanId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<LoanResponse> prolongLoan(@PathVariable int loanId) {
        return ResponseEntity.ok(loanService.prolongLoan(loanId));
    }

    @GetMapping("/{loanId}")
    @PreAuthorize("hasAnyRole('ADMIN','LIBRARIAN')")
    public ResponseEntity<LoanResponse> getLoanById(@PathVariable int loanId) {
        return ResponseEntity.ok(loanService.getLoanById(loanId));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','LIBRARIAN')")
    public ResponseEntity<List<LoanResponse>> getAllLoans() {
        return ResponseEntity.ok(loanService.getAllLoans());
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasAnyRole('ADMIN','LIBRARIAN')")
    public ResponseEntity<List<LoanResponse>> getLoansByUser(@PathVariable int userId) {
        return ResponseEntity.ok(loanService.getLoansByUser(userId));
    }

    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<LoanResponse>> getMyLoans(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(loanService.getLoansByUser(user.getUserId()));
    }

    @GetMapping("/active")
    @PreAuthorize("hasAnyRole('ADMIN','LIBRARIAN')")
    public ResponseEntity<List<LoanResponse>> getAllActiveLoans() {
        return ResponseEntity.ok(loanService.getAllActiveLoans());
    }
}
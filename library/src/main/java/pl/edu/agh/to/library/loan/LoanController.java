package pl.edu.agh.to.library.loan;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import pl.edu.agh.to.library.loan.dto.LoanResponse;

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
    public ResponseEntity<LoanResponse> returnBook(@PathVariable int loanId) {
        return ResponseEntity.ok(loanService.returnLoan(loanId));
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
}
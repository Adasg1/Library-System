package pl.edu.agh.to.library.loan;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LoanRepository extends JpaRepository<Loan, Integer> {
    List<Loan> findByUser_UserId(int userId);
    List<Loan> findByStatus(LoanStatus status);
}

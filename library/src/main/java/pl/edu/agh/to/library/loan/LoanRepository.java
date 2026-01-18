package pl.edu.agh.to.library.loan;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LoanRepository extends JpaRepository<Loan, Integer> {
    List<Loan> findByUser_UserId(int userId);
    List<Loan> findByStatus(LoanStatus status);

    @Query("SELECT l FROM Loan l WHERE l.status <> pl.edu.agh.to.library.loan.LoanStatus.RETURNED ORDER BY l.dueDate ASC")
    List<Loan> findAllActiveLoans();
}

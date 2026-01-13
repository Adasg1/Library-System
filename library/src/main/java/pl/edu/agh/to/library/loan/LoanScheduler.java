package pl.edu.agh.to.library.loan;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class LoanScheduler {

    private final LoanService loanService;

    public LoanScheduler(LoanService loanService) {
        this.loanService = loanService;
    }

    @Scheduled(cron = "0 0 1 * * *")
    public void checkOverdueLoans() {
        loanService.updateOverdueLoans();
    }
}
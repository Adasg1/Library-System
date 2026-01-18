package pl.edu.agh.to.library.opinion_reactions;

import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import pl.edu.agh.to.library.opinions.dto.OpinionResponse;
import pl.edu.agh.to.library.user.User;

import java.util.List;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/api/opinion-reaction")
public class OpinionReactionController {

    private final OpinionReactionService opinionReactionService;

    public OpinionReactionController(OpinionReactionService opinionReactionService) {
        this.opinionReactionService = opinionReactionService;
    }

    @PostMapping("/{opinionId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<OpinionReaction> react(
            @PathVariable int opinionId,
            @RequestParam Reaction reaction,
            @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(opinionReactionService.createOrUpdateReaction(user,opinionId,reaction));
    }

    @ExceptionHandler(NoSuchElementException.class)
    public ProblemDetail handleException(NoSuchElementException ex) {
        return ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND,"Opinion by that id not found");
    }
}

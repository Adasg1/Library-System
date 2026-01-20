package pl.edu.agh.to.library.opinion;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import pl.edu.agh.to.library.opinion.dto.CreateOpinionRequest;
import pl.edu.agh.to.library.opinion.dto.OpinionResponse;
import pl.edu.agh.to.library.opinion.dto.UpdateOpinionRequest;
import pl.edu.agh.to.library.user.Role;
import pl.edu.agh.to.library.user.User;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

@RestController
@RequestMapping("/api/opinion")
public class OpinionController {

    private final OpinionService opinionService;

    public OpinionController(OpinionService opinionService){
        this.opinionService = opinionService;
    }

    @PostMapping("")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<OpinionResponse> createOpinion(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody CreateOpinionRequest request
    ) {
        return ResponseEntity.ok(
                OpinionResponse.from(opinionService.createOpinion(user, request.bookId(), request.content()))
        );
    }

    @GetMapping("")
    @PreAuthorize("permitAll()")
    public ResponseEntity<List<OpinionResponse>> getOpinions(
            @RequestParam int bookId,
            @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(opinionService.getOpinionsByBookId(bookId, user));
    }

    @GetMapping("/my")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<OpinionResponse>> getMyOpinions(
            @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(opinionService.getOpinionsByUserId(user.getUserId()));
    }

    @PatchMapping("/{opinionId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<OpinionResponse> updateOpinion(
            @PathVariable int opinionId,
            @AuthenticationPrincipal User user,
            @RequestBody UpdateOpinionRequest request
    ) {
        ResponseEntity<OpinionResponse> check = checkAuthority(opinionId,user);
        if (check != null)
            return check;

        return ResponseEntity.ok(
                OpinionResponse.from(opinionService.updateOpinion(opinionId, request.content()))
        );
    }

    @DeleteMapping("/{opinionId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> deleteOpinion(
            @PathVariable int opinionId,
            @AuthenticationPrincipal User user
    ) {
        ResponseEntity<Void> check = checkAuthority(opinionId,user);
        if (check != null)
            return check;

        opinionService.deleteOpinion(opinionId);
        return ResponseEntity.ok().build();
    }

    private <T> ResponseEntity<T> checkAuthority(int opinionId, User user){
        Optional<Opinion> option = opinionService.getOpinionById(opinionId);
        if (option.isEmpty())
            return ResponseEntity.notFound().build();
        Opinion opinion = option.get();
        if (user.getRole() != Role.ADMIN && user.getUserId() != opinion.getUser().getUserId())
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        return null;
    }


    @ExceptionHandler(NoSuchElementException.class)
    public ProblemDetail handleException(NoSuchElementException ex) {
        return ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND,ex.getMessage());
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ProblemDetail handleException(IllegalArgumentException ex) {
        return ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST,ex.getMessage());
    }

    @ExceptionHandler(IllegalStateException.class)
    public ProblemDetail handleException(IllegalStateException ex) {
        return ProblemDetail.forStatusAndDetail(HttpStatus.CONFLICT,ex.getMessage());
    }
}

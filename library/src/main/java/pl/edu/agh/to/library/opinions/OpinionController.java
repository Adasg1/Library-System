package pl.edu.agh.to.library.opinions;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import pl.edu.agh.to.library.opinions.dto.CreateOpinionRequest;
import pl.edu.agh.to.library.opinions.dto.OpinionResponse;
import pl.edu.agh.to.library.user.User;

import java.util.List;

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
        return ResponseEntity.ok(opinionService.createOpinion(user, request.bookId(), request.content()));
    }

    @GetMapping("")
    @PreAuthorize("permitAll()")
    public ResponseEntity<List<OpinionResponse>> getOpinions(
            @RequestParam int bookId
    ) {
        return ResponseEntity.ok(opinionService.getOpinionsByBookId(bookId));
    }
}

package pl.edu.agh.to.library.opinions;

import jakarta.transaction.Transactional;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import org.springframework.stereotype.Service;
import pl.edu.agh.to.library.book.Book;
import pl.edu.agh.to.library.book.BookRepository;
import pl.edu.agh.to.library.opinion_reactions.OpinionReaction;
import pl.edu.agh.to.library.opinion_reactions.OpinionReactionRepository;
import pl.edu.agh.to.library.opinion_reactions.Reaction;
import pl.edu.agh.to.library.opinions.dto.OpinionResponse;
import pl.edu.agh.to.library.user.User;

import java.util.List;
import java.util.Optional;

@Service
public class OpinionService {

    private final OpinionRepository opinionRepository;
    private final BookRepository bookRepository;
    private final OpinionReactionRepository opinionReactionRepository;

    public OpinionService(OpinionRepository opinionRepository, BookRepository bookRepository, OpinionReactionRepository opinionReactionRepository) {
        this.opinionRepository = opinionRepository;
        this.bookRepository = bookRepository;
        this.opinionReactionRepository = opinionReactionRepository;
    }

    public Opinion createOpinion(User user, int bookId, String content) {
        if (opinionRepository.findByUser_UserIdAndBook_BookId(user.getUserId(),bookId).isPresent())
            throw new IllegalStateException("User already posted a review for this book");
        Book book = bookRepository.findById(bookId).orElseThrow();
        Opinion opinion = new Opinion(content, book, user);

        return opinionRepository.save(opinion);
    }

    public Opinion updateOpinion(int opinionId, String content){
        Opinion opinion = opinionRepository.findById(opinionId).orElseThrow();

        opinion.setContent(content);

        return opinionRepository.save(opinion);
    }

    public List<OpinionResponse> getOpinionsByBookId(int bookId, User currentUser) {
        List<Opinion> opinions = opinionRepository.findAllByBooksByIdSorted(bookId);

        return opinions.stream().map(op -> {
            String reactionStatus = "NONE";
            if (currentUser != null) {
                reactionStatus = opinionReactionRepository
                        .findByUser_UserIdAndOpinion_OpinionId(currentUser.getUserId(), op.getOpinionId())
                        .map(r -> r.getReaction().toString())
                        .orElse("NONE");
            }
            return OpinionResponse.from(op, reactionStatus);
        }).toList();
    }

    public List<OpinionResponse> getOpinionsByUserId(int userId) {
        List<Opinion> opinions = opinionRepository.findAllByUser_UserId(userId);

        return opinions.stream()
                .map(op -> OpinionResponse.from(op, "NONE")) // Mapowanie na DTO
                .toList();
    }

    public Optional<Opinion> getOpinionById(int opinionId){
        return opinionRepository.findById(opinionId);
    }


    public boolean deleteOpinion(int id) {
        if (opinionRepository.existsById(id)) {
            opinionRepository.deleteById(id);
            return true;
        }
        return false;
    }



    @Transactional
    public void updateReactionValues(int opinionId){
        Opinion opinion = opinionRepository.findById(opinionId).orElseThrow();
        int likes = 0;
        int dislikes = 0;
        for (OpinionReaction reaction: opinion.getReactions()){
            if (reaction.getReaction() == Reaction.LIKE)
                likes += 1;
            else if(reaction.getReaction() == Reaction.DISLIKE)
                dislikes += 1;
        }
        opinion.setLikes(likes);
        opinion.setDislikes(dislikes);
        opinionRepository.save(opinion);
    }

}

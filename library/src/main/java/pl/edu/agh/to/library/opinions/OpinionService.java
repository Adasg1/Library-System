package pl.edu.agh.to.library.opinions;

import jakarta.transaction.Transactional;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import org.springframework.stereotype.Service;
import pl.edu.agh.to.library.book.Book;
import pl.edu.agh.to.library.book.BookRepository;
import pl.edu.agh.to.library.opinion_reactions.OpinionReaction;
import pl.edu.agh.to.library.opinion_reactions.Reaction;
import pl.edu.agh.to.library.opinions.dto.OpinionResponse;
import pl.edu.agh.to.library.user.User;

import java.util.List;
import java.util.Optional;

@Service
public class OpinionService {

    private final OpinionRepository opinionRepository;
    private final BookRepository bookRepository;

    public OpinionService(OpinionRepository opinionRepository, BookRepository bookRepository) {
        this.opinionRepository = opinionRepository;
        this.bookRepository = bookRepository;
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

    public List<Opinion> getOpinionsByBookId(int bookId) {
        return opinionRepository.findAllByBooksByIdSorted(bookId);
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

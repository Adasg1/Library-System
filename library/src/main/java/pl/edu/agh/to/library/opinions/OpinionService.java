package pl.edu.agh.to.library.opinions;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import org.springframework.stereotype.Service;
import pl.edu.agh.to.library.book.Book;
import pl.edu.agh.to.library.book.BookRepository;
import pl.edu.agh.to.library.opinions.dto.OpinionResponse;
import pl.edu.agh.to.library.user.User;

import java.util.List;

@Service
public class OpinionService {

    private final OpinionRepository opinionRepository;
    private final BookRepository bookRepository;

    public OpinionService(OpinionRepository opinionRepository, BookRepository bookRepository) {
        this.opinionRepository = opinionRepository;
        this.bookRepository = bookRepository;
    }

    public OpinionResponse createOpinion(User user, int bookId, String content) {
        Book book = bookRepository.findById(bookId).orElseThrow();
        Opinion opinion = new Opinion(content, book, user);

        opinionRepository.save(opinion);

        return OpinionResponse.from(opinion);
    }

    public List<OpinionResponse> getOpinionsByBookId(int bookId) {
        return opinionRepository.findAllByBooksByIdSorted(bookId)
                .stream()
                .map(OpinionResponse::from)
                .toList();
    }
}

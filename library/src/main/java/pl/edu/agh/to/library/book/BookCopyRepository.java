package pl.edu.agh.to.library.book;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BookCopyRepository extends JpaRepository<BookCopy, Integer> {
    List<BookCopy> findByBook_BookId(int bookId);

    Optional<BookCopy> findFirstByBook_BookIdAndStatus(int bookId, BookStatus status);
}

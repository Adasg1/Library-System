package pl.edu.agh.to.library.book;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import pl.edu.agh.to.library.book.dto.BookBriefResponse;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookRepository extends JpaRepository<Book, Integer> {

    Optional<Book> findByIsbn(String isbn);

    List<Book> findByTitleContaining(String titleFragment);

    @Query("SELECT new pl.edu.agh.to.library.book.dto.BookBriefResponse(b, CAST(COUNT(bc) AS int)) " +
            "FROM Book b " +
            "JOIN b.categories c " +
            "LEFT JOIN b.bookCopies bc ON bc.status = pl.edu.agh.to.library.book.BookStatus.AVAILABLE " +
            "WHERE c.categoryId = :categoryId " +
            "GROUP BY b.bookId, b.title, b.author, b.isbn")
    List<BookBriefResponse> findAllByCategoryId(@Param("categoryId") int categoryId);

    @Query("SELECT new pl.edu.agh.to.library.book.dto.BookBriefResponse(" +
            "b.bookId, b.title, b.author, b.isbn, " +
            "CAST(SUM(CASE WHEN bc.status = pl.edu.agh.to.library.book.BookStatus.AVAILABLE THEN 1 ELSE 0 END) AS int)) " +
            "FROM Book b " +
            "LEFT JOIN b.bookCopies bc " +
            "GROUP BY b.bookId, b.title, b.author, b.isbn")
    List<BookBriefResponse> findAllBooksWithAvailableCount();

    @Query("SELECT new pl.edu.agh.to.library.book.dto.BookBriefResponse(" +
            "b.bookId, b.title, b.author, b.isbn, " +
            "CAST(SUM(CASE WHEN bc.status = pl.edu.agh.to.library.book.BookStatus.AVAILABLE THEN 1 ELSE 0 END) AS int)) " +
            "FROM Book b " +
            "LEFT JOIN b.bookCopies bc " +
            "WHERE b.bookId = :id " +
            "GROUP BY b.bookId, b.title, b.author, b.isbn")
    Optional<BookBriefResponse> findBookByIdWithAvailableCount(@Param("id") int id);
}

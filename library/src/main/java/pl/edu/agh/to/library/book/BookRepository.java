package pl.edu.agh.to.library.book;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import pl.edu.agh.to.library.book.dto.BookBriefResponse;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookRepository extends JpaRepository<Book, Integer> {

    Optional<Book> findByIsbn(String isbn);

    List<Book> findByTitleContaining(String titleFragment);

    List<Book> findTop8ByOrderByCreatedAtDesc();

    @Query("SELECT b FROM Book b " +
            "LEFT JOIN b.bookCopies bc " +
            "LEFT JOIN Loan l ON l.bookCopy = bc " +
            "GROUP BY b " +
            "ORDER BY COUNT(l) DESC")
    List<Book> findTopPopularBooks(Pageable pageable);

    @Query("SELECT new pl.edu.agh.to.library.book.dto.BookBriefResponse(b, CAST(COUNT(bc) AS int)) " +
            "FROM Book b " +
            "JOIN b.categories c " +
            "LEFT JOIN b.bookCopies bc ON bc.status = pl.edu.agh.to.library.bookcopy.BookStatus.AVAILABLE " +
            "WHERE c.categoryId = :categoryId " +
            "GROUP BY b.bookId, b.title, b.author, b.isbn, b.createdAt")
    List<BookBriefResponse> findAllByCategoryId(@Param("categoryId") int categoryId);

    // trochę to redundantne, ale tak najłatwiej było mi zrobić filtrowanie + sortowanie na raz
    // 1. Kategoria + Alfabetycznie
    @Query("SELECT new pl.edu.agh.to.library.book.dto.BookBriefResponse(" +
            "b.bookId, b.title, b.author, b.isbn, b.createdAt, " +
            "CAST(SUM(CASE WHEN bc.status = pl.edu.agh.to.library.bookcopy.BookStatus.AVAILABLE THEN 1 ELSE 0 END) AS int)) " +
            "FROM Book b " +
            "JOIN b.categories c " +
            "LEFT JOIN b.bookCopies bc " +
            "WHERE c.categoryId = :categoryId " +
            "GROUP BY b.bookId, b.title, b.author, b.isbn, b.createdAt " +
            "ORDER BY b.title ASC")
    List<BookBriefResponse> findByCategoryIdOrderedByTitle(@Param("categoryId") int categoryId);

    // 2. Kategoria + Najnowsze
    @Query("SELECT new pl.edu.agh.to.library.book.dto.BookBriefResponse(" +
            "b.bookId, b.title, b.author, b.isbn, b.createdAt, " +
            "CAST(SUM(CASE WHEN bc.status = pl.edu.agh.to.library.bookcopy.BookStatus.AVAILABLE THEN 1 ELSE 0 END) AS int)) " +
            "FROM Book b " +
            "JOIN b.categories c " +
            "LEFT JOIN b.bookCopies bc " +
            "WHERE c.categoryId = :categoryId " +
            "GROUP BY b.bookId, b.title, b.author, b.isbn, b.createdAt " +
            "ORDER BY b.createdAt DESC")
    List<BookBriefResponse> findByCategoryIdOrderedByNewest(@Param("categoryId") int categoryId);

    // 3. Kategoria + Dostępność
    @Query("SELECT new pl.edu.agh.to.library.book.dto.BookBriefResponse(" +
            "b.bookId, b.title, b.author, b.isbn, b.createdAt, " +
            "CAST(SUM(CASE WHEN bc.status = pl.edu.agh.to.library.bookcopy.BookStatus.AVAILABLE THEN 1 ELSE 0 END) AS int)) " +
            "FROM Book b " +
            "JOIN b.categories c " +
            "LEFT JOIN b.bookCopies bc " +
            "WHERE c.categoryId = :categoryId " +
            "GROUP BY b.bookId, b.title, b.author, b.isbn, b.createdAt " +
            "ORDER BY SUM(CASE WHEN bc.status = pl.edu.agh.to.library.bookcopy.BookStatus.AVAILABLE THEN 1 ELSE 0 END) DESC")
    List<BookBriefResponse> findByCategoryIdOrderedByAvailability(@Param("categoryId") int categoryId);

    // 4. Kategoria + Popularność
    @Query("SELECT new pl.edu.agh.to.library.book.dto.BookBriefResponse(" +
            "b.bookId, b.title, b.author, b.isbn, b.createdAt, " +
            "CAST(SUM(CASE WHEN bc.status = pl.edu.agh.to.library.bookcopy.BookStatus.AVAILABLE THEN 1 ELSE 0 END) AS int)) " +
            "FROM Book b " +
            "JOIN b.categories c " +
            "LEFT JOIN b.bookCopies bc " +
            "WHERE c.categoryId = :categoryId " +
            "GROUP BY b.bookId, b.title, b.author, b.isbn, b.createdAt " +
            "ORDER BY (SELECT COUNT(l) FROM Loan l WHERE l.bookCopy.book = b) DESC")
    List<BookBriefResponse> findByCategoryIdOrderedByPopularity(@Param("categoryId") int categoryId);

    @Query("SELECT new pl.edu.agh.to.library.book.dto.BookBriefResponse(" +
            "b.bookId, b.title, b.author, b.isbn, b.createdAt, " +
            "CAST(SUM(CASE WHEN bc.status = pl.edu.agh.to.library.bookcopy.BookStatus.AVAILABLE THEN 1 ELSE 0 END) AS int)) " +
            "FROM Book b " +
            "LEFT JOIN b.bookCopies bc " +
            "GROUP BY b.bookId, b.title, b.author, b.isbn, b.createdAt ")
    List<BookBriefResponse> findAllBooksWithAvailableCount();

    @Query("SELECT new pl.edu.agh.to.library.book.dto.BookBriefResponse(" +
            "b.bookId, b.title, b.author, b.isbn, b.createdAt, " +
            "CAST(SUM(CASE WHEN bc.status = pl.edu.agh.to.library.bookcopy.BookStatus.AVAILABLE THEN 1 ELSE 0 END) AS int)) " +
            "FROM Book b " +
            "LEFT JOIN b.bookCopies bc " +
            "WHERE b.bookId = :id " +
            "GROUP BY b.bookId, b.title, b.author, b.isbn, b.createdAt ")
    Optional<BookBriefResponse> findBookByIdWithAvailableCount(@Param("id") int id);

    // Sortowanie alfabetyczne (a-z)
    @Query("SELECT new pl.edu.agh.to.library.book.dto.BookBriefResponse(" +
            "b.bookId, b.title, b.author, b.isbn, b.createdAt, " +
            "CAST(SUM(CASE WHEN bc.status = pl.edu.agh.to.library.bookcopy.BookStatus.AVAILABLE THEN 1 ELSE 0 END) AS int)) " +
            "FROM Book b " +
            "LEFT JOIN b.bookCopies bc " +
            "GROUP BY b.bookId, b.title, b.author, b.isbn, b.createdAt " +
            "ORDER BY b.title ASC")
    List<BookBriefResponse> findAllOrderedByTitle();

    // Sortowanie po najnowszych
    @Query("SELECT new pl.edu.agh.to.library.book.dto.BookBriefResponse(" +
            "b.bookId, b.title, b.author, b.isbn, b.createdAt, " +
            "CAST(SUM(CASE WHEN bc.status = pl.edu.agh.to.library.bookcopy.BookStatus.AVAILABLE THEN 1 ELSE 0 END) AS int)) " +
            "FROM Book b " +
            "LEFT JOIN b.bookCopies bc " +
            "GROUP BY b.bookId, b.title, b.author, b.isbn, b.createdAt " +
            "ORDER BY b.createdAt DESC")
    List<BookBriefResponse> findAllOrderedByNewest();

    // Sortowanie po dostępności (najwięcej wolnych egzemplarzy na górze)
    @Query("SELECT new pl.edu.agh.to.library.book.dto.BookBriefResponse(" +
            "b.bookId, b.title, b.author, b.isbn, b.createdAt, " +
            "CAST(SUM(CASE WHEN bc.status = pl.edu.agh.to.library.bookcopy.BookStatus.AVAILABLE THEN 1 ELSE 0 END) AS int)) " +
            "FROM Book b " +
            "LEFT JOIN b.bookCopies bc " +
            "GROUP BY b.bookId, b.title, b.author, b.isbn, b.createdAt " +
            "ORDER BY SUM(CASE WHEN bc.status = pl.edu.agh.to.library.bookcopy.BookStatus.AVAILABLE THEN 1 ELSE 0 END) DESC")
    List<BookBriefResponse> findAllOrderedByAvailability();

    // Sortowanie po popularności (liczba wszystkich wypożyczeń dla danej książki)
    @Query("SELECT new pl.edu.agh.to.library.book.dto.BookBriefResponse(" +
            "b.bookId, b.title, b.author, b.isbn, b.createdAt, " +
            "CAST(SUM(CASE WHEN bc.status = pl.edu.agh.to.library.bookcopy.BookStatus.AVAILABLE THEN 1 ELSE 0 END) AS int)) " +
            "FROM Book b " +
            "LEFT JOIN b.bookCopies bc " +
            "GROUP BY b.bookId, b.title, b.author, b.isbn, b.createdAt " +
            "ORDER BY (SELECT COUNT(l) FROM Loan l WHERE l.bookCopy.book = b) DESC")
    List<BookBriefResponse> findAllOrderedByPopularity();

    @Query("SELECT new pl.edu.agh.to.library.book.dto.BookBriefResponse(" +
            "b.bookId, b.title, b.author, b.isbn, b.createdAt, " +
            "CAST(SUM(CASE WHEN bc.status = pl.edu.agh.to.library.bookcopy.BookStatus.AVAILABLE THEN 1 ELSE 0 END) AS int)) " +
            "FROM Book b " +
            "JOIN b.categories c " +
            "LEFT JOIN b.bookCopies bc " +
            "WHERE b.bookId <> :bookId " +
            "AND c IN (SELECT c2 FROM Book b2 JOIN b2.categories c2 WHERE b2.bookId = :bookId) " +
            "GROUP BY b.bookId, b.title, b.author, b.isbn, b.createdAt " +
            "ORDER BY (SELECT COUNT(l) FROM Loan l WHERE l.bookCopy.book = b) DESC")
    List<BookBriefResponse> findRelatedBooksOrderByPopularity(@Param("bookId") int bookId, Pageable pageable);
}
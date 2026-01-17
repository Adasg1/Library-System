package pl.edu.agh.to.library.opinions;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface OpinionRepository extends JpaRepository<Opinion, Integer> {

    @Query("SELECT o FROM Opinion o JOIN FETCH o.user WHERE o.book.bookId = :bookId ORDER BY (o.likes - o.dislikes) DESC")
    List<Opinion> findAllByBooksByIdSorted(@Param("bookId") int bookId);
}

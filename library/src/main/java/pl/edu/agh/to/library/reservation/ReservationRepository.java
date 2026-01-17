package pl.edu.agh.to.library.reservation;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pl.edu.agh.to.library.user.User;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Integer> {
    List<Reservation> findAllByUser_UserIdOrderByReservationDateDesc(int userId);

    Optional<Reservation> findFirstByBook_BookIdAndStatusOrderByReservationDateAsc(int bookId, ReservationStatus status);

    List<Reservation> findAllByStatusAndMaxPickupDateBefore(ReservationStatus status, LocalDateTime now);

    Optional<Reservation> findFirstByUser_UserIdAndBook_BookIdAndStatusIn(
            int userId,
            int bookId,
            Collection<ReservationStatus> statuses
    );

    Optional<Reservation> findByAssignedCopy_BookCopyIdAndStatus(int bookCopyId, ReservationStatus status);

    Reservation user(User user);

    List<Reservation> findByBook_BookId(Integer bookId);
}

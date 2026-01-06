package pl.edu.agh.to.library.reservation;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Integer> {
    List<Reservation> findAllByUser_UserIdOrderByReservationDateDesc(int userId);

    Optional<Reservation> findFirstByBook_BookIdAndStatusOrderByReservationDateAsc(int bookId, ReservationStatus status);

    List<Reservation> findAllByStatusAndMaxPickupDateBefore(ReservationStatus status, LocalDateTime now);
}

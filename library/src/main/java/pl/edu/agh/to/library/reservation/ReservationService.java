package pl.edu.agh.to.library.reservation;

import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;
import pl.edu.agh.to.library.book.*;
import pl.edu.agh.to.library.user.User;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final BookRepository bookRepository;
    private final BookCopyService bookCopyService;
    private final BookCopyRepository bookCopyRepository;

    public ReservationService(ReservationRepository reservationRepository, BookRepository bookRepository, BookCopyService bookCopyService, BookCopyRepository bookCopyRepository) {
        this.reservationRepository = reservationRepository;
        this.bookRepository = bookRepository;
        this.bookCopyService = bookCopyService;
        this.bookCopyRepository = bookCopyRepository;
    }

    @Transactional
    public Reservation createReservation(User user, int bookId, LocalDateTime reservationDate){
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new RuntimeException("Book with id " + bookId + " not found"));

        Reservation reservation = new Reservation(user, book, reservationDate);

        Optional<BookCopy> availableCopy = bookCopyRepository.findFirstByBook_BookIdAndStatus(bookId, BookStatus.AVAILABLE);

        if (availableCopy.isPresent()) {
            BookCopy copy = availableCopy.get();
            reservation.setStatus(ReservationStatus.READY);
            reservation.setMaxPickupDate(LocalDateTime.now().plusDays(3));
            reservation.setAssignedCopy(copy);
            bookCopyService.updateStatus(copy.getBookCopyId(), BookStatus.RESERVED);
        }
        return reservationRepository.save(reservation);
    }

    @Transactional
    public Reservation cancelReservation(int userId, int reservationId) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new RuntimeException("Reservation with id " + reservationId + " not found"));
        if (reservation.getUser().getUserId() != userId) {
            throw new RuntimeException("Reservation do not belong to user with id: " + userId);
        }

        boolean wasStatusReady = reservation.getStatus() == ReservationStatus.READY;
        reservation.setStatus(ReservationStatus.CANCELED);
        BookCopy assignedCopy = reservation.getAssignedCopy();

        Reservation savedReservation = reservationRepository.save(reservation);

        if (wasStatusReady && assignedCopy != null) {
            redistributeBookCopy(assignedCopy);
        }

        return savedReservation;
    }

    public List<Reservation> getUserReservations(int userId) {
        return reservationRepository.findAllByUser_UserIdOrderByReservationDateDesc(userId);
    }

    public List<Reservation> getReservations( ) {
        return reservationRepository.findAll();
    }

    @Transactional
    public void redistributeBookCopy(BookCopy copy) {
        Optional<Reservation> waitingReservation = reservationRepository
                .findFirstByBook_BookIdAndStatusOrderByReservationDateAsc(copy.getBook().getBookId(), ReservationStatus.WAITING);

        if (waitingReservation.isPresent()) {

            Reservation reservation = waitingReservation.get();
            reservation.setStatus(ReservationStatus.READY);
            reservation.setMaxPickupDate(LocalDateTime.now().plusDays(3));
            reservation.setAssignedCopy(copy);
            bookCopyService.updateStatus(copy.getBookCopyId(), BookStatus.RESERVED);
            reservationRepository.save(reservation);
            // TODO Logika wysyłania powiadomień np. na email
        }
        else {
            bookCopyService.updateStatus(copy.getBookCopyId(), BookStatus.AVAILABLE);
        }
    }

    @Transactional
    public void cleanupExpiredReservations() {
        LocalDateTime now = LocalDateTime.now();
        List<Reservation> expiredReservations = reservationRepository
                .findAllByStatusAndMaxPickupDateBefore(ReservationStatus.READY, now);

        for (Reservation reservation : expiredReservations) {
            BookCopy copy = reservation.getAssignedCopy();
            reservation.setStatus(ReservationStatus.CANCELED);

            if (copy != null) {
                redistributeBookCopy(copy);
            } else {
                System.err.println("Błąd spójności danych: Rezerwacja " + reservation.getReservationId() + " o statusie READY bez przypisanej kopii!");
            }
        }
        reservationRepository.saveAll(expiredReservations);
    }
}

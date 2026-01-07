package pl.edu.agh.to.library.reservation;

import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;
import pl.edu.agh.to.library.book.*;
import pl.edu.agh.to.library.notification.NotificationService;
import pl.edu.agh.to.library.reservation.dto.ReservationResponse;
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
    private final NotificationService notificationService;

    public ReservationService(ReservationRepository reservationRepository, BookRepository bookRepository, BookCopyService bookCopyService, BookCopyRepository bookCopyRepository, NotificationService notificationService) {
        this.reservationRepository = reservationRepository;
        this.bookRepository = bookRepository;
        this.bookCopyService = bookCopyService;
        this.bookCopyRepository = bookCopyRepository;
        this.notificationService = notificationService;
    }

    @Transactional
    public Reservation createReservation(User user, int bookId, LocalDateTime reservationDate){
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new RuntimeException("Book with id " + bookId + " not found"));

        var statuses = List.of(ReservationStatus.WAITING, ReservationStatus.READY);
        Optional<Reservation> existingReservation = reservationRepository
                .findFirstByUser_UserIdAndBook_BookIdAndStatusIn(user.getUserId(), bookId, statuses);

        if (existingReservation.isPresent()) {
            throw new IllegalStateException("User " + user.getUserId() + " already has an active reservation for book " + bookId);
        }

        Reservation reservation = new Reservation(user, book, reservationDate);

        Optional<BookCopy> availableCopy = bookCopyRepository.findFirstByBook_BookIdAndStatus(bookId, BookStatus.AVAILABLE);

        if (availableCopy.isPresent()) {
            BookCopy copy = availableCopy.get();
            reservation.setStatus(ReservationStatus.READY);
            reservation.setMaxPickupDate(LocalDateTime.now().plusDays(3));
            reservation.setAssignedCopy(copy);
            bookCopyService.updateStatus(copy.getBookCopyId(), BookStatus.RESERVED);
            notificationService.sendBookAvailableNotification(user, book.getTitle());
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

    public List<ReservationResponse> getUserReservations(int userId) {
        return reservationRepository
                .findAllByUser_UserIdOrderByReservationDateDesc(userId)
                .stream()
                .map(ReservationResponse::from)
                .toList();
    }

    public List<Reservation> getBookReservations(int bookId) {
        return reservationRepository.findByBook_BookId(bookId);
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
            notificationService.sendBookAvailableNotification(reservation.getUser(), copy.getBook().getTitle());
            System.out.println("Sending email for book copy with id" + copy.getBookCopyId());
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
                System.err.println("Error: Reservation " + reservation.getReservationId() + " with status READY without assigned book copy!");
            }
        }
        reservationRepository.saveAll(expiredReservations);
    }

    public void updateReservationAfterLoan(int userId, int bookId) {
        var statuses = List.of(ReservationStatus.READY);
        Optional<Reservation> userReservation = reservationRepository
                .findFirstByUser_UserIdAndBook_BookIdAndStatusIn(userId, bookId, statuses);

        userReservation.ifPresent(reservation -> {
            reservation.setStatus(ReservationStatus.COMPLETED);
            reservationRepository.save(reservation);
        });
    }

    @Transactional
    public BookCopy swapReservation(int userId, BookCopy copy) {
        Reservation otherUserReservation = reservationRepository
                .findByAssignedCopy_BookCopyIdAndStatus(copy.getBookCopyId(), ReservationStatus.READY)
                .orElseThrow(() -> new IllegalStateException("Data inconsistency: Copy is RESERVED but no Reservation found!"));

        if (otherUserReservation.getUser().getUserId() == userId) {
            copy.setStatus(BookStatus.AVAILABLE);
            return copy;
        }

        Optional<Reservation> optUserReservation = reservationRepository
                .findFirstByUser_UserIdAndBook_BookIdAndStatusIn(userId, copy.getBook().getBookId(), List.of(ReservationStatus.READY));
        if (optUserReservation.isPresent()) {
            Reservation userReservation = optUserReservation.get();
            BookCopy userCopy = userReservation.getAssignedCopy();
            if (userCopy != null) {
                userReservation.setAssignedCopy(copy);
                otherUserReservation.setAssignedCopy(userCopy);

                reservationRepository.save(userReservation);
                reservationRepository.save(otherUserReservation);

                copy.setStatus(BookStatus.AVAILABLE);
                return copy;
            }
        }
        Optional<BookCopy> replacementCopy = bookCopyRepository.findFirstByBook_BookIdAndStatus(copy.getBook().getBookId(), BookStatus.AVAILABLE);
        if (replacementCopy.isPresent()) {
            BookCopy availableCopy = replacementCopy.get();

            otherUserReservation.setAssignedCopy(availableCopy);
            bookCopyService.updateStatus(availableCopy.getBookCopyId(), BookStatus.RESERVED);

            reservationRepository.save(otherUserReservation);

            copy.setStatus(BookStatus.AVAILABLE);
            return copy;
        }

        throw new IllegalStateException("This copy is reserved! No more available copies!");
    }
}

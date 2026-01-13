package pl.edu.agh.to.library.book;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.edu.agh.to.library.book.dto.BookCopyResponse;

import java.util.ArrayList;
import java.util.List;

@Service
public class BookCopyService {

    private final BookCopyRepository bookCopyRepository;
    private final BookService bookService;

    public BookCopyService(BookCopyRepository bookCopyRepository, BookService bookService) {
        this.bookCopyRepository = bookCopyRepository;
        this.bookService = bookService;
    }

    public BookCopyResponse addCopy(int bookId, BookStatus status) {
        Book book = bookService.getBookById(bookId)
                .orElseThrow(() -> new NullPointerException("Book with id: " + bookId + " does not exist"));

        BookCopy copy = new BookCopy(book, status);
        return BookCopyResponse.from(bookCopyRepository.save(copy));
    }

    @Transactional
    public List<BookCopyResponse> addCopies(int bookId, BookStatus status, int amount) {
        if (amount <= 0) throw new IllegalArgumentException("Amount must be greater than 0");
        Book book = bookService.getBookById(bookId)
                .orElseThrow(() -> new NullPointerException("Book with id: " + bookId + " does not exist"));

        List<BookCopy> copies = new ArrayList<>();
        for (int i = 0; i < amount; i++) {
            copies.add(new BookCopy(book, status));
        }

        return bookCopyRepository.saveAll(copies).stream()
                .map(BookCopyResponse::from)
                .toList();
    }

    public BookCopy getCopyEntityById(int id) {
        return bookCopyRepository.findById(id)
                .orElseThrow(() -> new NullPointerException("BookCopy not found with id: " + id));
    }

    public BookCopyResponse getCopyById(int copyId) {
        BookCopy copy = getCopyEntityById(copyId);
        return BookCopyResponse.from(copy);
    }

    public List<BookCopyResponse> getAllCopies() {
        return bookCopyRepository.findAll().stream()
                .map(BookCopyResponse::from)
                .toList();
    }

    public List<BookCopyResponse> getCopiesByBookId(int bookId) {
        return bookCopyRepository.findByBook_BookId(bookId).stream()
                .map(BookCopyResponse::from)
                .toList();
    }

    public BookCopyResponse updateStatus(int copyId, BookStatus newStatus) {
        return bookCopyRepository.findById(copyId)
                .map(copy -> {
                    copy.setStatus(newStatus);
                    return bookCopyRepository.save(copy);
                })
                .map(BookCopyResponse::from)
                .orElseThrow(() -> new NullPointerException("BookCopy not found with id: " + copyId));
    }

    public boolean deleteCopy(int id) {
        if (bookCopyRepository.existsById(id)) {
            bookCopyRepository.deleteById(id);
            return true;
        }
        return false;
    }

}

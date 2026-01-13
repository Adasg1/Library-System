package pl.edu.agh.to.library.book;

import jakarta.transaction.Transactional;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import pl.edu.agh.to.library.book.dto.BookCopyResponse;

import java.util.List;

@RestController
@RequestMapping(path="/api/bookcopy")
public class BookCopyController {

    private final BookCopyService bookCopyService;

    public BookCopyController(BookCopyService bookCopyService) {
        this.bookCopyService = bookCopyService;
    }

    @PostMapping("/add/{bookId}")
    @PreAuthorize("hasAnyRole('ADMIN','LIBRARIAN')")
    public ResponseEntity<BookCopyResponse> addCopy(@PathVariable int bookId, @RequestParam BookStatus status) {
        return ResponseEntity.status(201).body(bookCopyService.addCopy(bookId, status));
    }

    @PostMapping("/add-multiple/{bookId}")
    @PreAuthorize("hasAnyRole('ADMIN','LIBRARIAN')")
    public ResponseEntity<List<BookCopyResponse>> addMultipleCopies(@PathVariable int bookId, @RequestParam BookStatus status, @RequestParam int amount) {
        List<BookCopyResponse> createdCopies = bookCopyService.addCopies(bookId, status, amount);
        return ResponseEntity.status(201).body(createdCopies);
    }

    @GetMapping
    public ResponseEntity<List<BookCopyResponse>> getAllCopies() {
        return ResponseEntity.ok(bookCopyService.getAllCopies());
    }

    @GetMapping("/book/{bookId}")
    public ResponseEntity<List<BookCopyResponse>> getCopiesByBook(@PathVariable int bookId) {
        return ResponseEntity.ok(bookCopyService.getCopiesByBookId(bookId));
    }

    @GetMapping("/{copyId}")
    public ResponseEntity<BookCopyResponse> getCopyById(@PathVariable int copyId) {
        return ResponseEntity.ok(bookCopyService.getCopyById(copyId));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN','LIBRARIAN')")
    public ResponseEntity<BookCopyResponse> updateStatus(@PathVariable int id, @RequestParam BookStatus status) {
        return ResponseEntity.ok(bookCopyService.updateStatus(id, status));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteCopy(@PathVariable int id) {
        if (bookCopyService.deleteCopy(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}

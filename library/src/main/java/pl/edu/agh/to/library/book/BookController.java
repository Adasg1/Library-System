package pl.edu.agh.to.library.book;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import pl.edu.agh.to.library.book.dto.BookBriefResponse;
import pl.edu.agh.to.library.book.dto.BookCreationRequest;
import pl.edu.agh.to.library.book.dto.BookFullResponse;
import pl.edu.agh.to.library.book.dto.BookUpdateRequest;

import java.util.List;

@RestController
@RequestMapping(path="/api/book")
public class BookController {

    private final BookService bookService;

    public BookController(BookService bookService) {
        this.bookService = bookService;
    }

    @PostMapping("/add")
    @PreAuthorize("hasAnyRole('ADMIN','LIBRARIAN')")
    public ResponseEntity<BookFullResponse> addBook(@Valid @RequestBody BookCreationRequest request){
        Book createdBook = bookService.createBook(request);
        return ResponseEntity.status(201).body(new BookFullResponse(createdBook));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','LIBRARIAN')")
    public ResponseEntity<BookFullResponse> updateBook(@PathVariable int id, @Valid @RequestBody BookUpdateRequest request) {
        Book updatedBook = bookService.updateBook(id,request);

        return ResponseEntity.ok(new BookFullResponse(updatedBook));
    }

    @GetMapping("/full")
    public ResponseEntity<List<BookFullResponse>> getAllBooksFull() {
        return ResponseEntity.ok(
                bookService.getAllBooks().stream().map(BookFullResponse::new).toList()
        );
    }

    @GetMapping("/full/{id}")
    public ResponseEntity<BookFullResponse> getBookByIdFull(@PathVariable int id) {
        return bookService.getBookById(id)
                .map(BookFullResponse::new)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/brief")
    public ResponseEntity<List<BookBriefResponse>> getAllBooksBrief() {
        return ResponseEntity.ok(
                bookService.getAllBookBriefs()
        );
    }

    @GetMapping("/brief/{id}")
    public ResponseEntity<BookBriefResponse> getBookByIdBrief(@PathVariable int id) {
        return bookService.getBookBriefById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<BookBriefResponse>> getBooksByCategory(@PathVariable int categoryId) {
        List<BookBriefResponse> books = bookService.getBooksByCategoryId(categoryId);
        return ResponseEntity.ok(books);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteBook(@PathVariable int id) {
        boolean deleted = bookService.deleteBook(id);
        if (deleted) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }


    @ExceptionHandler(NullPointerException.class)
    public ProblemDetail handleException(NullPointerException ex) {
        return ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND,ex.getMessage());
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ProblemDetail handleException(IllegalArgumentException ex) {
        return ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST,ex.getMessage());
    }

    @ExceptionHandler(IllegalStateException.class)
    public ProblemDetail handleException(IllegalStateException ex) {
        return ProblemDetail.forStatusAndDetail(HttpStatus.CONFLICT,ex.getMessage());
    }
}

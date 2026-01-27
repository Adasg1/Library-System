package pl.edu.agh.to.library.book.dto;

import jakarta.validation.constraints.NotBlank;
import pl.edu.agh.to.library.book.Book;

import java.time.LocalDateTime;

public record BookBriefResponse(
        @NotBlank int bookId,
        @NotBlank String title,
        @NotBlank String author,
        @NotBlank String isbn,
        @NotBlank LocalDateTime createdAt,
        @NotBlank int availableCopies
) {

    public BookBriefResponse(Book book, int availableCopies){
        this(
                book.getBookId(),
                book.getTitle(),
                book.getAuthor(),
                book.getIsbn(),
                book.getCreatedAt(),
                availableCopies
        );
    }
}

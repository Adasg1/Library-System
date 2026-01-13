package pl.edu.agh.to.library.book.dto;

import jakarta.validation.constraints.NotBlank;
import pl.edu.agh.to.library.book.Book;

public record BookBriefResponse(
        @NotBlank int bookId,
        @NotBlank String title,
        @NotBlank String author,
        @NotBlank String isbn,
        @NotBlank int availableCopies
) {

    public BookBriefResponse(Book book, int availableCopies){
        this(
                book.getBookId(),
                book.getTitle(),
                book.getAuthor(),
                book.getIsbn(),
                availableCopies
        );
    }
}

package pl.edu.agh.to.library.book.dto;

import jakarta.validation.constraints.NotBlank;
import pl.edu.agh.to.library.book.Book;

public record BookBriefResponse(
        @NotBlank int bookId,
        @NotBlank String title,
        @NotBlank String author
) {

    public BookBriefResponse(Book book){
        this(
                book.getBookId(),
                book.getTitle(),
                book.getAuthor()
        );
    }
}

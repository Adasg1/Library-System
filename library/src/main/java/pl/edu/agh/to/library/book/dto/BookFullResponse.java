package pl.edu.agh.to.library.book.dto;

import jakarta.validation.constraints.NotBlank;
import pl.edu.agh.to.library.book.Book;

import java.util.List;

public record BookFullResponse(
        @NotBlank int bookId,
        @NotBlank String title,
        @NotBlank String isbn,
        @NotBlank String author,
        @NotBlank String description,
        @NotBlank String publisher,
        @NotBlank int publishYear,
        @NotBlank List<String> categoryNames
) {

    public BookFullResponse(Book book){
        this(
                book.getBookId(),
                book.getTitle(),
                book.getIsbn(),
                book.getAuthor(),
                book.getDescription(),
                book.getPublisher(),
                book.getPublishYear(),
                book.getCategoryNames()
        );
    }
}

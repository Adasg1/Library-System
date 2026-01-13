package pl.edu.agh.to.library.book.dto;

import jakarta.validation.constraints.NotBlank;
import pl.edu.agh.to.library.book.BookCopy;
import pl.edu.agh.to.library.book.BookStatus;

public record BookCopyResponse(
        @NotBlank int id,
        @NotBlank int bookId,
        @NotBlank String title,
        @NotBlank BookStatus status
) {
    public static BookCopyResponse from(BookCopy copy) {
        return new BookCopyResponse(
                copy.getBookCopyId(),
                copy.getBook().getBookId(),
                copy.getBook().getTitle(),
                copy.getStatus()
        );
    }
}
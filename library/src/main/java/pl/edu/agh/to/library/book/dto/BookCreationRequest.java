package pl.edu.agh.to.library.book.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record BookCreationRequest(
        @NotBlank String title,
        @NotBlank String isbn,
        @NotBlank String author,
        @NotBlank String description,
        @NotBlank String publisher,
        @NotNull int publishYear,
        @NotNull List<String> categoryNames
) {
}

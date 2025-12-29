package pl.edu.agh.to.library.book.dto;

import jakarta.validation.constraints.NotBlank;

import java.util.List;

public record BookCreationRequest(
        @NotBlank String title,
        @NotBlank String isbn,
        @NotBlank String author,
        @NotBlank String description,
        @NotBlank String publisher,
        @NotBlank int publishYear,
        @NotBlank List<String> categoryNames
) {
}

package pl.edu.agh.to.library.book.dto;

import jakarta.validation.constraints.NotBlank;

import java.util.List;

public record BookUpdateRequest(
        String title,
        String isbn,
        String author,
        String description,
        String publisher,
        Integer publishYear,
        List<String> categoryNames
) {
}

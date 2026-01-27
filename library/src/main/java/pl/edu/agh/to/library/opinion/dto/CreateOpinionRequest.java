package pl.edu.agh.to.library.opinion.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record CreateOpinionRequest(
        @NotNull @Positive int bookId,
        @NotBlank String content
) {
}

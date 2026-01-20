package pl.edu.agh.to.library.opinion.dto;

import jakarta.validation.constraints.NotBlank;

public record UpdateOpinionRequest(
        @NotBlank String content
) {
}

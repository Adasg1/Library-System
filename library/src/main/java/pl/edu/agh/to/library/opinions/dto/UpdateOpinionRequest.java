package pl.edu.agh.to.library.opinions.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record UpdateOpinionRequest(
        @NotBlank String content
) {
}

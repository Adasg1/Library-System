package pl.edu.agh.to.library.user.dto;

import jakarta.annotation.Nullable;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import pl.edu.agh.to.library.user.Role;

public record UserUpdateRequest(
        String firstName,
        String lastName,
        @Email String email,
        @Size(min=8) String password,
        Role role
) {
}

package pl.edu.agh.to.library.auth.dto;

public record AuthenticationResponse(
        String token,
        String email,
        String firstName,
        String lastName,
        String role
) {
}

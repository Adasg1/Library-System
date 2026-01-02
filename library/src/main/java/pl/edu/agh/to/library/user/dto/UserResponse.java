package pl.edu.agh.to.library.user.dto;

import pl.edu.agh.to.library.user.Role;
import pl.edu.agh.to.library.user.User;

public record UserResponse(
        Integer id,
        String firstName,
        String lastName,
        String email,
        String role
) {
    public static UserResponse from(User user) {
        return new UserResponse(
                user.getUserId(),
                user.getFirstName(),
                user.getLastName(),
                user.getUsername(),
                user.getRole().name()
        );
    }
}

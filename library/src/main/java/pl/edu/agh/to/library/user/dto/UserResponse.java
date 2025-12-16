package pl.edu.agh.to.library.user.dto;

import pl.edu.agh.to.library.user.Role;

public record UserResponse(
        Integer id,
        String firstName,
        String lastName,
        String email,
        String role
) {}

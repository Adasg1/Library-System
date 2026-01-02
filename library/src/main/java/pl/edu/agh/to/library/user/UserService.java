package pl.edu.agh.to.library.user;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import pl.edu.agh.to.library.user.dto.UserCreateRequest;
import pl.edu.agh.to.library.user.dto.UserResponse;
import pl.edu.agh.to.library.user.dto.UserUpdateRequest;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public UserResponse createUser(UserCreateRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new RuntimeException("Email already exists");
        }
        User user = new User(
                request.firstName(),
                request.lastName(),
                request.email(),
                passwordEncoder.encode(request.password()),
                request.role()
        );
        userRepository.save(user);
        return UserResponse.from(user);
    }

    public List<UserResponse> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(UserResponse::from)
                .toList();
    }

    public Optional<UserResponse> getUserById(int id) {
        return userRepository.findById(id).map(UserResponse::from);
    }

    public UserResponse updateUser(int id, UserUpdateRequest userDetails) {
        return userRepository.findById(id)
                .map(existingUser -> {
                    if (userDetails.firstName() != null && !userDetails.firstName().isBlank()) {
                        existingUser.setFirstName(userDetails.firstName());
                    }
                    if (userDetails.lastName() != null && !userDetails.lastName().isBlank()) {
                        existingUser.setLastName(userDetails.lastName());
                    }
                    if (userDetails.email() != null && !userDetails.email().isBlank()
                            && !userDetails.email().equals(existingUser.getUsername())) {

                        if (userRepository.existsByEmail(userDetails.email())) {
                            throw new RuntimeException("Email already exists");
                        }
                        existingUser.setEmail(userDetails.email());
                    }
                    if (userDetails.password() != null) {
                        existingUser.setPassword(passwordEncoder.encode(userDetails.password()));
                    }
                    if (userDetails.role() != null) {
                        existingUser.setRole(userDetails.role());
                    }
                    return userRepository.save(existingUser);
                })
                .map(UserResponse::from)
                .orElse(null);
    }

    public boolean deleteUser(int id) {
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
            return true;
        }
        return false;
    }
}

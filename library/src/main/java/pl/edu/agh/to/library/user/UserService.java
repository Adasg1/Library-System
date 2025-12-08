package pl.edu.agh.to.library.user;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User createUser(User user) {
        return userRepository.save(user);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUserById(int id) {
        return userRepository.findById(id);
    }

    public User updateUser(int id, User userDetails) {
        return userRepository.findById(id)
                .map(existingUser -> {
                    if (userDetails.getFirstName() != null && !userDetails.getFirstName().isEmpty()) {
                        existingUser.setFirstName(userDetails.getFirstName());
                    }
                    if (userDetails.getLastName() != null && !userDetails.getLastName().isEmpty()) {
                        existingUser.setLastName(userDetails.getLastName());
                    }
                    if (userDetails.getUsername() != null && !userDetails.getUsername().isEmpty()) {
                        existingUser.setEmail(userDetails.getUsername());
                    }
                    if (userDetails.getPassword() != null) {
                        existingUser.setPassword(userDetails.getPassword());
                    }
                    if (userDetails.getRole() != null) {
                        existingUser.setRole(userDetails.getRole());
                    }
                    return userRepository.save(existingUser);
                })
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

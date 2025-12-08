package pl.edu.agh.to.library.auth;

import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import pl.edu.agh.to.library.auth.dto.AuthenticationResponse;
import pl.edu.agh.to.library.auth.dto.LoginRequest;
import pl.edu.agh.to.library.auth.dto.RegisterRequest;
import pl.edu.agh.to.library.config.JwtService;
import pl.edu.agh.to.library.user.Role;
import pl.edu.agh.to.library.user.UserRepository;
import pl.edu.agh.to.library.user.User;


@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService){
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public AuthenticationResponse register(RegisterRequest request){
        var user = new User(
                request.firstName(),
                request.lastName(),
                request.email(),
                passwordEncoder.encode(request.password()),
                Role.READER
                );

        userRepository.save(user);
        var jwt = jwtService.generateToken(user);
        return new AuthenticationResponse(jwt, user.getUsername(), user.getFirstName(), user.getLastName(), user.getRole().name());
    }

    public AuthenticationResponse login(LoginRequest request){
        User user = userRepository.findByEmail(request.username())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new BadCredentialsException("Invalid password");
        }
        var jwt =  jwtService.generateToken(user);
        return new AuthenticationResponse(jwt, user.getUsername(), user.getFirstName(), user.getLastName(), user.getRole().name());
    }
}

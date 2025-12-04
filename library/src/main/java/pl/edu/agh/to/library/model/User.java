package pl.edu.agh.to.library.model;

import pl.edu.agh.to.library.model.enums.Role;

import java.util.List;

public class User {

    private int userId;

    private String firstName;

    private String lastName;

    private String email;

    private String hashedPassword;

    private Role role;

    private List<Loan> loans;

    private List<Reservation> reservations;
}

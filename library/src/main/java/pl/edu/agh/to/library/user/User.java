package pl.edu.agh.to.library.user;

import jakarta.persistence.*;
import pl.edu.agh.to.library.loan.Loan;
import pl.edu.agh.to.library.loan.Reservation;

import java.util.List;

@Entity
@Table(name="Users")
public class User {

    @Id
    @GeneratedValue
    private int userId;

    private String firstName;

    private String lastName;

    @Column(unique = true)
    private String email;

    private String hashedPassword;

    private Role role;

    @OneToMany(mappedBy = "user")
    private List<Loan> loans;

    @OneToMany(mappedBy = "user")
    private List<Reservation> reservations;
}

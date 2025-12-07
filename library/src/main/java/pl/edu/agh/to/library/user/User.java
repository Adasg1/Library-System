package pl.edu.agh.to.library.user;

import com.fasterxml.jackson.annotation.JsonIgnore;
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
    @JsonIgnore
    private List<Loan> loans;

    @OneToMany(mappedBy = "user")
    @JsonIgnore
    private List<Reservation> reservations;

    public User(String firstName,String lastName, String email, String hashedPassword, Role role){
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.hashedPassword = hashedPassword;
        this.role = role;
    }

    public User() {
    }

    //region getters-setters
    public int getUserId() {
        return userId;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getHashedPassword() {
        return hashedPassword;
    }

    public void setHashedPassword(String hashedPassword) {
        this.hashedPassword = hashedPassword;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public List<Loan> getLoans() {
        return loans;
    }

    public boolean addLoan(Loan loan){
        return this.loans.add(loan);
    }

    public List<Reservation> getReservations() {
        return reservations;
    }

    public boolean addReservation(Reservation reservation){
        return this.reservations.add(reservation);
    }

    public boolean removeReservation(Reservation reservation){
        return this.reservations.remove(reservation);
    }
    //endregion
}

package pl.edu.agh.to.library.book;

import jakarta.persistence.*;
import pl.edu.agh.to.library.loan.Reservation;

import java.util.List;
import java.util.Set;

@Entity
@Table(name="Books")
public class Book {

    @Id
    @GeneratedValue
    private int bookId;

    private String title;

    @Column(unique = true)
    private String isbn;

    private String author;

    private String description;

    private String publisher;

    private int publishYear;

    @ManyToMany
    @JoinTable(
            name="BookCategories",
            joinColumns=@JoinColumn(name="bookId"),
            inverseJoinColumns=@JoinColumn(name="categoryId")
    )
    private Set<Category> categories;

    @OneToMany(mappedBy = "book")
    private List<BookCopy> bookCopies;

    @OneToMany(mappedBy = "book")
    private List<Reservation> reservations;

}

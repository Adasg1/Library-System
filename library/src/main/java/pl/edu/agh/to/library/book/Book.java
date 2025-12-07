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

    public Book(String title, String isbn,String author,String publisher,int publishYear){
        this.title = title;
        this.isbn = isbn;
        this.author = author;
        this.publisher = publisher;
        this.publishYear = publishYear;
    }


    //region getters-setters
    public int getBookId() {
        return bookId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getIsbn() {
        return isbn;
    }

    public void setIsbn(String isbn) {
        this.isbn = isbn;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getPublisher() {
        return publisher;
    }

    public void setPublisher(String publisher) {
        this.publisher = publisher;
    }

    public int getPublishYear() {
        return publishYear;
    }

    public void setPublishYear(int publishYear) {
        this.publishYear = publishYear;
    }

    public Set<Category> getCategories() {
        return categories;
    }

    public void addCategory(Category category) {
        this.categories.add(category);
    }

    public boolean removeCategory(Category category) {
        return this.categories.remove(category);
    }

    public List<BookCopy> getBookCopies() {
        return bookCopies;
    }

    public boolean addBookCopy(BookCopy bookCopy) {
        return this.bookCopies.add(bookCopy);
    }

    public boolean removeBookCopy(BookCopy bookCopy) {
        return this.bookCopies.remove(bookCopy);
    }

    public List<Reservation> getReservations() {
        return reservations;
    }

    public boolean addReservation(Reservation reservation) {
        return this.reservations.add(reservation);
    }

    public boolean removeReservation(Reservation reservation) {
        return this.reservations.remove(reservation);
    }
    //endregion
}

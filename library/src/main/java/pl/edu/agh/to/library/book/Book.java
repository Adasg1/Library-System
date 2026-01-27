package pl.edu.agh.to.library.book;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import pl.edu.agh.to.library.bookcopy.BookCopy;
import pl.edu.agh.to.library.category.Category;
import pl.edu.agh.to.library.opinion.Opinion;
import pl.edu.agh.to.library.reservation.Reservation;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
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

    @Column(columnDefinition = "TEXT")
    private String description;

    private String publisher;

    private int publishYear;

    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "book", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Opinion> opinions = new ArrayList<>();


    @ManyToMany
    @JoinTable(
            name="BookCategories",
            joinColumns=@JoinColumn(name="bookId"),
            inverseJoinColumns=@JoinColumn(name="categoryId")
    )
    @JsonIgnore
    private Set<Category> categories;

    @OneToMany(mappedBy = "book")
    @JsonIgnore
    private List<BookCopy> bookCopies;

    @OneToMany(mappedBy = "book")
    @JsonIgnore
    private List<Reservation> reservations;

    public Book(String title, String isbn,String author,String description,String publisher,int publishYear){
        this.title = title;
        this.isbn = isbn;
        this.author = author;
        this.description = description;
        this.publisher = publisher;
        this.publishYear = publishYear;
        this.categories = new HashSet<>();
        this.bookCopies = new ArrayList<>();
        this.reservations = new ArrayList<>();
        this.createdAt = LocalDateTime.now();
    }

    public Book() {
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

    public List<Opinion> getOpinions() { return opinions; }

    public void setOpinions(List<Opinion> opinions) { this.opinions = opinions; }

    public Set<Category> getCategories() {
        return categories;
    }

    public List<String> getCategoryNames() {
        return categories.stream().map(Category::getCategoryName).toList();
    }

    public void addCategory(Category category) {
        this.categories.add(category);
    }

    public boolean removeCategory(Category category) {
        return this.categories.remove(category);
    }

    public void removeAllCategories(){
        this.categories = new HashSet<>();
    }

    public List<BookCopy> getBookCopies() {
        return bookCopies;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    //Wszystko z dołu jest raczej do usunięcia
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

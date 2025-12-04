package pl.edu.agh.to.library.model;

import java.util.List;
import java.util.Set;

public class Book {

    private int bookId;

    private String title;

    private String isbn;

    private String author;

    private String description;

    private String publisher;

    private int publishYear;

    private Set<Category> categories;

    private List<BookCopy> bookCopies;

    private List<Reservation> reservations;

}

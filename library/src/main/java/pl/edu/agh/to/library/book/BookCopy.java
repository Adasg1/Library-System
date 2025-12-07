package pl.edu.agh.to.library.book;

import jakarta.persistence.*;

@Entity
@Table(name="BookCopies")
public class BookCopy {

    @Id
    @GeneratedValue
    private int bookCopyId;

    @ManyToOne
    @JoinColumn(name = "bookId")
    private Book book;

    private BookStatus status;
}

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

    protected BookCopy() {
    }

    public BookCopy(Book book, BookStatus status){
        this.book = book;
        this.status = status;
    }

    //region getters-setters
    public int getBookCopyId() {
        return bookCopyId;
    }

    public Book getBook() {
        return book;
    }

    public BookStatus getStatus() {
        return status;
    }

    public void setStatus(BookStatus status) {
        this.status = status;
    }
    //endregion
}

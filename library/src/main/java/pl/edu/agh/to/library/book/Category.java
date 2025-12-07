package pl.edu.agh.to.library.book;

import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name="Categories")
public class Category {

    @Id
    @GeneratedValue
    private int categoryId;

    private String categoryName;

    @ManyToMany
    @JoinTable(
            name="BookCategories",
            joinColumns=@JoinColumn(name="categoryId"),
            inverseJoinColumns=@JoinColumn(name="bookId")
        )
    private List<Book> books;


    //region getters-setters
    public int getCategoryId() {
        return categoryId;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public List<Book> getBooks() {
        return books;
    }

    public void setBooks(List<Book> books) {
        this.books = books;
    }
    //endregion

}

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

    public Category(String name){
        this.categoryName = name;
    }

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

    public boolean addBook(Book book){
        return this.books.add(book);
    }

    public boolean removeBook(Book book){
        return this.books.remove(book);
    }
    //endregion

}

package pl.edu.agh.to.library.model;

import java.util.List;

public class Category {

    private int categoryId;

    private String categoryName;

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

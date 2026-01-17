package pl.edu.agh.to.library.book;

import org.springframework.stereotype.Service;
import pl.edu.agh.to.library.book.dto.BookBriefResponse;
import pl.edu.agh.to.library.book.dto.BookCreationRequest;
import pl.edu.agh.to.library.book.dto.BookUpdateRequest;
import pl.edu.agh.to.library.category.Category;
import pl.edu.agh.to.library.category.CategoryService;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
public class BookService {

    private final BookRepository bookRepository;
    private final CategoryService categoryService;

    public BookService(BookRepository bookRepository, CategoryService categoryService) {
        this.bookRepository = bookRepository;
        this.categoryService = categoryService;
    }

    public Book createBook(BookCreationRequest request){
        if (!isIsbnValid(request.isbn()))
            throw new IllegalArgumentException("The ISBN number is not valid");

        if (bookRepository.findByIsbn(request.isbn()).isPresent())
            throw new IllegalStateException("Book with this ISBN already exists");

        Book book = new Book(
                request.title(),
                request.isbn(),
                request.author(),
                request.description(),
                request.publisher(),
                request.publishYear()
        );

        for (String name : request.categoryNames()){
            Optional<Category> cat = categoryService.getCategoryByName(name);
            if (cat.isEmpty())
                throw new NullPointerException("Category '" + name + "' not found");
            book.addCategory(cat.get());
        }

        return bookRepository.save(book);
    }

    public Book updateBook(int id,BookUpdateRequest request){
        Optional<Book> bookO = bookRepository.findById(id);

        if (bookO.isEmpty())
            throw new NullPointerException("Book by that id not found");
        Book book = bookO.get();

        if (!Objects.equals(request.isbn(), bookRepository.findById(id).get().getIsbn())){
            if (!isIsbnValid(request.isbn()))
                throw new IllegalArgumentException("The ISBN number is not valid");

            if (bookRepository.findByIsbn(request.isbn()).isPresent())
                throw new IllegalStateException("Book with this ISBN already exists");

            book.setIsbn(request.isbn());
        }

        if (request.categoryNames() != null){
            book.removeAllCategories();

            for (String name : request.categoryNames()){
                Optional<Category> cat = categoryService.getCategoryByName(name);
                if (cat.isEmpty())
                    throw new NullPointerException("Category '" + name + "' not found");
                book.addCategory(cat.get());
            }
        }

        if (request.title() != null)
            book.setTitle(request.title());

        if (request.author() != null)
            book.setAuthor(request.author());

        if (request.description() != null)
            book.setDescription(request.description());

        if (request.publisher() != null)
            book.setPublisher(request.publisher());

        if (request.publishYear() != null)
            book.setPublishYear(request.publishYear());

        return bookRepository.save(book);
    }


    public List<Book> getAllBooks(){

        return bookRepository.findAll();
    }

    public List<BookBriefResponse> getAllBookBriefs() {
        return bookRepository.findAllBooksWithAvailableCount();
    }

    public Optional<Book> getBookById(int id){
        return bookRepository.findById(id);
    }

    public Optional<BookBriefResponse> getBookBriefById(int id){
        return bookRepository.findBookByIdWithAvailableCount(id);
    }

    public List<BookBriefResponse> getBooksByCategoryId(int categoryId) {
        if (categoryService.getCategoryById(categoryId).isEmpty()) {
            throw new NullPointerException("Category by that id not found");
        }

        return bookRepository.findAllByCategoryId(categoryId);
    }

    public boolean deleteBook(int id) {
        if (bookRepository.existsById(id)) {
            bookRepository.deleteById(id);
            return true;
        }
        return false;
    }


    private boolean isIsbnValid(String isbn){
        if (isbn == null) return false;

        String numbers = isbn.replaceAll("-", "").replaceAll(" ", "");

        try {
            if (numbers.length() == 10) {
                //From https://en.wikipedia.org/wiki/ISBN
                int i, s = 0, t = 0;

                for (i = 0; i < 10; ++i) {
                    if (numbers.charAt(i) != 'X') {
                        t += Character.getNumericValue(numbers.charAt(i));
                    } else {
                        t += 10;
                    }
                    s += t;
                }
                return s % 11 == 0;
            } else if (numbers.length() == 13) {
                int s = 0;
                for (int i = 0; i < 13; i++) {
                    int a = Character.getNumericValue(numbers.charAt(i));
                    if (i % 2 == 1) {
                        a *= 3;
                    }
                    s += a;
                }
                return s % 10 == 0;
            }
        } catch (Exception e){
            return false;
        }

        return false;
    }

}

package pl.edu.agh.to.library.book;

import org.springframework.stereotype.Service;
import pl.edu.agh.to.library.book.dto.BookCreationRequest;

import java.util.List;
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
            if (cat.isEmpty()) continue;
            book.addCategory(cat.get());
        }

        return bookRepository.save(book);
    }

    public List<Book> getAllBooks(){
        return bookRepository.findAll();
    }

    public Optional<Book> getBookById(int id){
        return bookRepository.findById(id);
    }

    public boolean deleteBook(int id) {
        if (bookRepository.existsById(id)) {
            bookRepository.deleteById(id);
            return true;
        }
        return false;
    }

    private boolean isIsbnValid(String isbn){
        //TODO
        return true;
    }

}

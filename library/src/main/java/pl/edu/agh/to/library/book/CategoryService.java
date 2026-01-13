package pl.edu.agh.to.library.book;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public Category createCategory(Category category){
        if (categoryRepository.findByCategoryName(category.getCategoryName()).isPresent())
            throw new IllegalStateException("Category by that name already exists");

        return categoryRepository.save(category);
    }

    public Category updateName(int id, String name){
        if (categoryRepository.findByCategoryName(name).isPresent())
            throw new IllegalStateException("Category by that name already exists");

        return categoryRepository.findById(id).map(
                category -> {
                    category.setCategoryName(name);
                    return categoryRepository.save(category);
                }
        ).orElse(null);
    }

    public List<Category> getAllCategories(){
        return categoryRepository.findAll();
    }

    public Optional<Category> getCategoryById(int id){
        return categoryRepository.findById(id);
    }

    public Optional<Category> getCategoryByName(String name){
        return categoryRepository.findByCategoryName(name);
    }


    //Nie wiem co z kaskadowym usuwaniem
    public boolean deleteCategory(int id) {
        if (categoryRepository.existsById(id)) {
            categoryRepository.deleteById(id);
            return true;
        }
        return false;
    }
}

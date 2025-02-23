package com.boostmytool.beststore.controllers;

import com.boostmytool.beststore.models.Category;
import com.boostmytool.beststore.repositories.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/categories")
@CrossOrigin(origins = "http://localhost:3000")
public class CategoryController {

    @Autowired
    private CategoryRepository categoryRepository;

    // 📌 Récupérer toutes les catégories
    @GetMapping
    public ResponseEntity<List<Category>> getAllCategories() {
        return ResponseEntity.ok(categoryRepository.findAll());
    }

    // 📌 Récupérer une catégorie par ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getCategoryById(@PathVariable Long id) {
        Optional<Category> category = categoryRepository.findById(id);

        if (!category.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Catégorie non trouvée !");
        }

        return ResponseEntity.ok(category.get());
    }


    // 📌 Ajouter une catégorie
    @PostMapping
    public ResponseEntity<?> addCategory(@RequestBody Category category) {
        if (category.getName() == null || category.getName().trim().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Le nom de la catégorie ne peut pas être vide !");
        }

        if (categoryRepository.existsByName(category.getName())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Cette catégorie existe déjà !");
        }

        try {
            Category savedCategory = categoryRepository.save(category);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedCategory);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erreur lors de l'ajout de la catégorie.");
        }
    }


    @PutMapping("/{id}")
    public ResponseEntity<?> updateCategory(@PathVariable Long id, @RequestBody Category updatedCategory) {
        Optional<Category> existingCategory = categoryRepository.findById(id);

        if (!existingCategory.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Catégorie non trouvée !");
        }

        if (categoryRepository.existsByName(updatedCategory.getName()) && 
            !existingCategory.get().getName().equals(updatedCategory.getName())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Cette catégorie existe déjà !");
        }

        Category category = existingCategory.get();
        category.setName(updatedCategory.getName());

        categoryRepository.save(category);
        return ResponseEntity.ok(category);
    }

    // 📌 Supprimer une catégorie
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        if (!categoryRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        categoryRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}

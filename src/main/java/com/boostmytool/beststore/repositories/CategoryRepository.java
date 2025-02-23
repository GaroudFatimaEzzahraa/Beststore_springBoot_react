package com.boostmytool.beststore.repositories;

import com.boostmytool.beststore.models.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    boolean existsByName(String name);  // ✅ Vérifier l'existence d'une catégorie par son nom
}

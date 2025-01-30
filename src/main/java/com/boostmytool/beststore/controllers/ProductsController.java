package com.boostmytool.beststore.controllers;

import com.boostmytool.beststore.models.Product;
import com.boostmytool.beststore.services.ProductsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.ResponseEntity;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.io.File;
import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductsController {

    @Autowired
    private ProductsRepository repo;

    // 📌 Récupérer tous les produits
    @GetMapping
    public List<Product> getProducts() {
        return repo.findAll(Sort.by(Sort.Direction.DESC, "id"));
    }

    // 📌 Récupérer un produit par ID
    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {  
        Product product = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        return ResponseEntity.ok(product);
    }

    // 📌 Récupérer une image stockée
    @GetMapping("/images/{filename}")
    public ResponseEntity<Resource> getImage(@PathVariable String filename) {
        try {
            Path file = Paths.get("uploads").resolve(filename);
            Resource resource = new UrlResource(file.toUri());
            return ResponseEntity.ok().body(resource);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    // 📌 Ajouter un produit avec une image
    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<Product> createProduct(
            @RequestParam("name") String name,
            @RequestParam("brand") String brand,
            @RequestParam("category") String category,
            @RequestParam("price") double price,
            @RequestParam("description") String description,
            @RequestParam(value = "imageFile", required = false) MultipartFile imageFile) {

        try {
            Product product = new Product();
            product.setName(name);
            product.setBrand(brand);
            product.setCategory(category);
            product.setPrice(price);
            product.setDescription(description);

            // 📌 Vérifier et créer le dossier `uploads/` s'il n'existe pas
            File uploadDir = new File("uploads/");
            if (!uploadDir.exists()) {
                uploadDir.mkdirs();
            }

            if (imageFile != null && !imageFile.isEmpty()) {
                String originalFilename = imageFile.getOriginalFilename();
                assert originalFilename != null;
                
                // 📌 Conserver uniquement le nom original sans ajout de timestamp
                Path path = Paths.get("uploads/" + originalFilename);
                Files.copy(imageFile.getInputStream(), path);
                
                // 📌 Enregistrer le bon nom de fichier dans la base de données
                product.setImageFileName(originalFilename);
            }

            Product savedProduct = repo.save(product);
            return ResponseEntity.ok(savedProduct);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // 📌 **Correction de la mise à jour d'un produit**
    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(
            @PathVariable Long id,
            @RequestParam("name") String name,
            @RequestParam("brand") String brand,
            @RequestParam("category") String category,
            @RequestParam("price") Double price,
            @RequestParam("description") String description,
            @RequestParam(value = "imageFile", required = false) MultipartFile imageFile) {
        
        Product product = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id " + id));

        product.setName(name);
        product.setBrand(brand);
        product.setCategory(category);
        product.setPrice(price);
        product.setDescription(description);

        // 📌 Vérifier si une nouvelle image est téléchargée
        if (imageFile != null && !imageFile.isEmpty()) {
            try {
                String fileName = imageFile.getOriginalFilename(); // 🔥 Conserver le nom original
                Path filePath = Paths.get("uploads", fileName);
                Files.write(filePath, imageFile.getBytes());
                
                // 🔥 Mise à jour du champ image uniquement si une nouvelle image est ajoutée
                product.setImageFileName(fileName);
            } catch (IOException e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
            }
        }

        repo.save(product); // 🔥 Sauvegarde dans la BDD
        return ResponseEntity.ok(product);
    }

    // 📌 Supprimer un produit
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {  
        repo.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}

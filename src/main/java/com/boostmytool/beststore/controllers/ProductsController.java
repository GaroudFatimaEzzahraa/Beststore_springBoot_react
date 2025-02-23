package com.boostmytool.beststore.controllers;

import com.boostmytool.beststore.models.Product;
import com.boostmytool.beststore.services.ProductsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;

import java.nio.file.*;
import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/products")
public class ProductsController {

    @Autowired
    private ProductsRepository repo;

    private final Path uploadDir = Paths.get("uploads");

    // 📌 Récupérer tous les produits
    @GetMapping
    public List<Product> getProducts() {
        return repo.findAll();
    }

    // 📌 Récupérer un produit par ID
    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        Product product = repo.findById(id).orElseThrow(() -> new RuntimeException("Product not found"));
        return ResponseEntity.ok(product);
    }

    // 📌 Récupérer une image stockée
    @GetMapping("/images/{filename}")
    public ResponseEntity<Resource> getImage(@PathVariable String filename) {
        try {
            Path file = uploadDir.resolve(filename);
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
            @RequestParam("stock") int stock,
            @RequestParam("initialStock") int initialStock,
            @RequestParam("description") String description,
            @RequestParam(value = "imageFile", required = false) MultipartFile imageFile) {
        
        try {
            Product product = new Product();
            product.setName(name);
            product.setBrand(brand);
            product.setCategory(category);
            product.setPrice(price);
            product.setStock(stock);
            product.setInitialStock(initialStock);
            product.setDescription(description);
    
            // 📌 Vérifier et créer le dossier `uploads/` s'il n'existe pas
            File uploadDir = new File("uploads/");
            if (!uploadDir.exists()) {
                uploadDir.mkdirs();
            }
    
            if (imageFile != null && !imageFile.isEmpty()) {
                String originalFilename = imageFile.getOriginalFilename();
                assert originalFilename != null;
                
                // 📌 Ajouter un identifiant unique basé sur la date pour éviter les conflits de nom
                String uniqueFileName = UUID.randomUUID().toString() + "_" + originalFilename;
                
                Path path = Paths.get("uploads/" + uniqueFileName);
                Files.copy(imageFile.getInputStream(), path);
                
                // 📌 Enregistrer le nom unique du fichier dans la base de données
                product.setImageFileName(uniqueFileName);
                product.setImageUrl("/api/products/images/" + uniqueFileName);  // URL de l'image
            }
    
            Product savedProduct = repo.save(product);
            return ResponseEntity.ok(savedProduct);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                  .body(null);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                  .body(null);
        }
    }

    // 📌 Mise à jour d'un produit
    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(
            @PathVariable Long id,
            @RequestParam("name") String name,
            @RequestParam("brand") String brand,
            @RequestParam("category") String category,
            @RequestParam("price") double price,
            @RequestParam("stock") int stock,
            @RequestParam("initialStock") int initialStock,
            @RequestParam("description") String description,
            @RequestParam(value = "imageFile", required = false) MultipartFile imageFile) {

        Product product = repo.findById(id).orElseThrow(() -> new RuntimeException("Product not found with id " + id));
        product.setName(name);
        product.setBrand(brand);
        product.setCategory(category);
        product.setPrice(price);
        product.setStock(stock);
        product.setInitialStock(initialStock);
        product.setDescription(description);

        // 📌 Mise à jour de l'image
        if (imageFile != null && !imageFile.isEmpty()) {
            try {
                String fileName = UUID.randomUUID().toString() + "_" + imageFile.getOriginalFilename();
                Path filePath = Paths.get("uploads", fileName);
                Files.write(filePath, imageFile.getBytes());
                product.setImageFileName(fileName);
                product.setImageUrl("/api/products/images/" + fileName);
            } catch (IOException e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
            }
        }

        repo.save(product);
        return ResponseEntity.ok(product);
    }

    // 📌 Supprimer un produit
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        repo.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}

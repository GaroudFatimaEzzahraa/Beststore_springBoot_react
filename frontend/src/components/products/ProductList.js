import React, { useEffect, useState } from "react";// Importation des hooks React pour gérer l'état et les effets secondaires
import axios from "axios";// Importation d'axios pour faire des requêtes HTTP
import { Link } from "react-router-dom";// Importation de Link pour la navigation entre les pages
import { motion } from "framer-motion";// Importation de Framer Motion pour animer les éléments
import Sidebar from "../Sidebar"; // Importation de la sidebar
import "./ProductList.css";// Importation des styles CSS spécifiques au composant


const ProductList = () => {
  // Déclaration des états du composant
  const [products, setProducts] = useState([]);// Liste des produits
  const [search, setSearch] = useState("");// Terme de recherche
  const [category, setCategory] = useState("");// Filtre par catégorie
  const [brand, setBrand] = useState("");// Filtre par marque
  const [sortOrder, setSortOrder] = useState("asc");// Ordre de tri des prix (ascendant par défaut)
  const [viewMode, setViewMode] = useState("table");// Mode d'affichage (tableau ou cartes)

// États pour la pagination
  const [currentPage, setCurrentPage] = useState(1);// Page actuelle
  const itemsPerPage = 5; // Nombre d'éléments affichés par page

  // useEffect pour récupérer les produits au chargement du composant
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/products")// Requête GET pour récupérer les produits
      .then((response) => setProducts(response.data))// Mise à jour de l'état avec les données reçues
      .catch((error) => console.error("Error fetching products:", error));// Gestion des erreurs
  }, []);

    // Fonction pour supprimer un produit
  const deleteProduct = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {// Confirmation avant suppression
      axios
        .delete(`http://localhost:8080/api/products/${id}`)// Requête DELETE vers l'API
        .then(() => setProducts(products.filter((product) => product.id !== id)))// Mise à jour de la liste après suppression
        .catch((error) => console.error("Error deleting product:", error));// Gestion des erreurs
    }
  };

    // Filtrage des produits selon la recherche, la catégorie et la marque
  const filteredProducts = products
    .filter((product) => product.name.toLowerCase().includes(search.toLowerCase()))// Filtre par nom
    .filter((product) => (category ? product.category === category : true)) // Filtre par catégorie
    .filter((product) => (brand ? product.brand === brand : true))// Filtre par marque
    .sort((a, b) => (sortOrder === "asc" ? a.price - b.price : b.price - a.price));// Tri des produits par prix

  // Calcul de la pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);// Nombre total de pages
  const indexOfLastItem = currentPage * itemsPerPage;// Dernier élément de la page actuelle
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;// Premier élément de la page actuelle
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);// Produits affichés sur la page actuelle

  // Gestion du changement de page
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="page-container">
      <Sidebar viewMode={viewMode} setViewMode={setViewMode} /> {/* Affichage de la sidebar */}

      <div className="content">
        <h1 className="product-title">🛍️ Products</h1>

        {/* Filtres de recherche */}
        <div className="filters-container">
          <input
            type="text"
            placeholder="🔍 Search product..."
            className="search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select className="filter-select" onChange={(e) => setCategory(e.target.value)}>
            <option value="">All Categories</option>
            {Array.from(new Set(products.map((p) => p.category))).map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <select className="filter-select" onChange={(e) => setBrand(e.target.value)}>
            <option value="">All Brands</option>
            {Array.from(new Set(products.map((p) => p.brand))).map((brand) => (
              <option key={brand} value={brand}>{brand}</option>
            ))}
          </select>
          <button className="sort-btn" onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}>
            Sort by Price {sortOrder === "asc" ? "⬆️" : "⬇️"}
          </button>
        </div>

        {/*  Bouton d'ajout de produit */}
        <div className="add-product-container">
          <a href="/products/create" className="add-product-btn">+ Add New Product</a>
        </div>

        {/* Affichage des produits en tableau ou en cartes */}
        {viewMode === "table" ? (
          <table className="styled-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Brand</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Initial Stock</th>
                <th>Image</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((product) => (
                <motion.tr key={product.id}>
                  <td>{product.id}</td>
                  <td>{product.name}</td>
                  <td>{product.brand}</td>
                  <td>{product.category}</td>
                  <td>{product.price} MAD</td>
                  <td>{product.stock}</td>
                  <td>{product.initialStock}</td>
                  <td>
                    <img
                      src={`http://localhost:8080/api/products/images/${product.imageFileName}`}
                      alt={product.name}
                      className="product-image"
                    />
                  </td>
                  <td>
                    <div className="action-buttons">
                      <Link to={`/products/edit/${product.id}`} className="btn-edit">✏️ Edit</Link>
                      <button onClick={() => deleteProduct(product.id)} className="btn-delete">🗑️ Delete</button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="cards-container">
            {currentItems.map((product) => (
              <motion.div key={product.id} className="product-card">
                <img
                  src={`http://localhost:8080/api/products/images/${product.imageFileName}`}
                  alt={product.name}
                  className="product-card-image"
                />
                <h2>{product.name}</h2>
                <p>{product.brand} - {product.category}</p>
                <p>{product.price} MAD</p>
                <p className="stock-info">Stock: {product.stock} left</p>
                <p className="stock-info">Initial Stock: {product.initialStock}</p>
                <div className="card-actions">
                  <Link to={`/products/edit/${product.id}`} className="btn-edit">✏️ Edit</Link>
                  <button onClick={() => deleteProduct(product.id)} className="btn-delete">🗑️ Delete</button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className="pagination-container">
          <button
            className="pagination-btn"
            onClick={handlePrevPage}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className="pagination-info">
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="pagination-btn"
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductList;

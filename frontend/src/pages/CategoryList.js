import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Sidebar from "../components/Sidebar"; // Importation de la sidebar
import "./CategoryList.css";

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [viewMode, setViewMode] = useState("table"); // Mode d'affichage

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/categories")
      .then((response) => setCategories(response.data))
      .catch((error) => console.error("Error fetching categories:", error));
  }, []);

  const deleteCategory = (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      axios
        .delete(`http://localhost:8080/api/categories/${id}`)
        .then(() => setCategories(categories.filter((cat) => cat.id !== id)))
        .catch((error) => console.error("Error deleting category:", error));
    }
  };

  const filteredCategories = categories
    .filter((category) => category.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => (sortOrder === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)));

  return (
    <div className="page-container">
      <Sidebar viewMode={viewMode} setViewMode={setViewMode} /> {/* Sidebar avec Toggle View */}

      <div className="content">
        <h1 className="category-title">📂 List of Categories</h1>

        {/* Filtres */}
        <div className="filters-container">
          <input
            type="text"
            placeholder="🔍 Search category..."
            className="search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="sort-btn" onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}>
            Sort by Name {sortOrder === "asc" ? "⬆️" : "⬇️"}
          </button>
        </div>

        {/* Ajouter une catégorie */}
        <div className="add-category-container">
          <a href="/categories/create" className="add-category-btn">
            + Add New Category
          </a>
        </div>


        {/* Affichage des catégories en table ou en cartes */}
        {viewMode === "table" ? (
          <table className="styled-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCategories.map((category) => (
                <motion.tr key={category.id}>
                  <td>{category.id}</td>
                  <td>{category.name}</td>
                  <td>{new Date(category.createdAt).toLocaleString()}</td>
                  <td>
                    <div className="action-buttons">
                      <Link to={`/categories/edit/${category.id}`} className="btn-edit">✏️ Edit</Link>
                      <button onClick={() => deleteCategory(category.id)} className="btn-delete">🗑️ Delete</button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="cards-container">
            {filteredCategories.map((category) => (
              <motion.div key={category.id} className="category-card">
                <h2>{category.name}</h2>
                <p className="category-date">{new Date(category.createdAt).toLocaleString()}</p>
                <div className="card-actions">
                  <Link to={`/categories/edit/${category.id}`} className="btn-edit">✏️ Edit</Link>
                  <button onClick={() => deleteCategory(category.id)} className="btn-delete">🗑️ Delete</button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryList;

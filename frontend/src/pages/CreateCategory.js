import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./CreateCategory.css";

const CreateCategory = () => {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Vérifier si le mode sombre est activé
    const isDark = document.body.classList.contains("dark-mode");
    setDarkMode(isDark);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Le nom de la catégorie ne peut pas être vide !");
      return;
    }

    try {
      await axios.post("http://localhost:8080/api/categories", { name });
      navigate("/categories");
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setError("Cette catégorie existe déjà !");
      } else {
        setError("Une erreur s'est produite lors de l'ajout de la catégorie.");
      }
    }
  };

  return (
    <div className={`create-category-page ${darkMode ? "dark-mode" : ""}`}>
      <h2 className="title">➕ Add New Category</h2>
      <div className={`form-container ${darkMode ? "dark-bg" : ""}`}>
        {error && <p className="error-message">⚠️ {error}</p>}
        <form onSubmit={handleSubmit}>
          <label>Nom de catégorie:</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
          <button type="submit" className="btn btn-success">+ New Category</button>
        </form>
      </div>
      <Link to="/categories" className="btn btn-list">📜 Categories List</Link>
    </div>
  );
};

export default CreateCategory;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";
import "./EditCategory.css";

const EditCategory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    axios.get(`http://localhost:8080/api/categories/${id}`)
      .then((response) => {
        setName(response.data.name);
      })
      .catch((error) => {
        console.error("Erreur lors du chargement de la catégorie:", error);
        setError("⚠️ Erreur lors du chargement de la catégorie.");
      });
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("⚠️ Le nom de la catégorie ne peut pas être vide !");
      return;
    }

    try {
      await axios.put(`http://localhost:8080/api/categories/${id}`, { name });
      navigate("/categories");
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setError("⚠️ Cette catégorie existe déjà !");
      } else {
        setError("⚠️ Une erreur s'est produite lors de la mise à jour.");
      }
    }
  };

  return (
    <div className="edit-category-page">
      <h2 className="title">✏️ Modifier la Catégorie</h2>
      <div className="form-container">
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <label>Nom de catégorie:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <button type="submit" className="btn btn-warning">✏️ Modifier</button>
        </form>
      </div>
      <Link to="/categories" className="btn btn-list">📜 Retour à la liste</Link>
    </div>
  );
};

export default EditCategory;

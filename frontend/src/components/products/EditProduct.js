import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./EditProduct.css";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    name: "",
    brand: "",
    category: "",
    price: "",
    stock: "",
    initialStock: "",
    description: "",
    imageFileName: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/products/${id}`)
      .then((response) => {
        setProduct(response.data);
      })
      .catch((error) => console.error("Error fetching product:", error));
  }, [id]);

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);

    if (file) {
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", product.name);
    formData.append("brand", product.brand);
    formData.append("category", product.category);
    formData.append("price", product.price);
    formData.append("stock", product.stock);
    formData.append("initialStock", product.initialStock); // Envoi du stock initial
    formData.append("description", product.description);

    if (imageFile) {
      formData.append("imageFile", imageFile);
    }

    try {
      await axios.put(`http://localhost:8080/api/products/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate("/products");
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  return (
    <div className="edit-product-container">
      <h2 className="text-center">📝 Edit Product</h2>
      <div className="product-card">
        <form onSubmit={handleSubmit}>
          <label className="product-label">Product Name:</label>
          <input type="text" name="name" className="product-input" value={product.name} onChange={handleChange} required />

          <label className="product-label">Brand:</label>
          <input type="text" name="brand" className="product-input" value={product.brand} onChange={handleChange} required />

          <label className="product-label">Category:</label>
          <input type="text" name="category" className="product-input" value={product.category} onChange={handleChange} required />

          <label className="product-label">Price (MAD):</label>
          <input type="number" name="price" className="product-input" value={product.price} onChange={handleChange} required />

          <label className="product-label">Stock:</label>
          <input type="number" name="stock" className="product-input" value={product.stock} onChange={handleChange} required />

          <label className="product-label">Initial Stock:</label>
          <input type="number" name="initialStock" className="product-input" value={product.initialStock} onChange={handleChange} required />

          <label className="product-label">Description:</label>
          <textarea name="description" className="product-textarea" value={product.description} onChange={handleChange} required></textarea>

          <label className="product-label">Change Image:</label>
          <input type="file" name="imageFile" className="product-input" onChange={handleFileChange} />

          {previewImage && <img src={previewImage} alt="Preview" className="current-image" />}

          <div className="product-buttons">
            <button type="submit" className="btn-primary">Save Changes</button>
            <button type="button" className="btn-secondary" onClick={() => navigate("/products")}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;

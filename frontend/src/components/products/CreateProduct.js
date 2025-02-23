import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./CreateProduct.css"; 

const CreateProduct = () => {
    const [product, setProduct] = useState({
        name: "",
        brand: "",
        category: "",
        price: "",
        stock: "",
        initialStock: "",
        description: "",
        imageFile: null,
    });

    const [previewImage, setPreviewImage] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct({ ...product, [name]: value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setProduct({ ...product, imageFile: file });

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
        formData.append("initialStock", product.initialStock);
        formData.append("description", product.description);

        if (product.imageFile) {
            formData.append("imageFile", product.imageFile);
        }

        try {
            await axios.post("http://localhost:8080/api/products", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            navigate("/products");
        } catch (error) {
            console.error("Error creating product:", error.response);
            setError(
                error.response?.data?.message || "An unexpected error occurred."
            );
        }
    };

    return (
        <div className="create-product-container">
            <h2 className="text-center mb-4">🛍️ Create New Product</h2>
            <div className="product-card">
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <label className="product-label">Product Name</label>
                    <input
                        type="text"
                        className="product-input"
                        name="name"
                        value={product.name}
                        onChange={handleChange}
                        required
                    />

                    <label className="product-label">Brand</label>
                    <input
                        type="text"
                        className="product-input"
                        name="brand"
                        value={product.brand}
                        onChange={handleChange}
                        required
                    />

                    <label className="product-label">Category</label>
                    <select
                        className="product-select"
                        name="category"
                        value={product.category}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select a category</option>
                        <option value="Ordinateurs">Ordinateurs</option>
                        <option value="Phones">Phones</option>
                        <option value="Accessoires">Accessoires</option>
                        <option value="Électronique">Électronique</option>
                        <option value="Cameras">Cameras</option>
                        <option value="Printers">Printers</option>
                    </select>

                    <label className="product-label">Price (MAD)</label>
                    <input
                        type="number"
                        className="product-input"
                        name="price"
                        value={product.price}
                        onChange={handleChange}
                        required
                    />

                    <label className="product-label">Stock</label>
                    <input
                        type="number"
                        className="product-input"
                        name="stock"
                        value={product.stock}
                        onChange={handleChange}
                        required
                    />

                    <label className="product-label">Initial Stock</label>
                    <input
                        type="number"
                        className="product-input"
                        name="initialStock"
                        value={product.initialStock}
                        onChange={handleChange}
                        required
                    />

                    <label className="product-label">Description</label>
                    <textarea
                        className="product-textarea"
                        name="description"
                        value={product.description}
                        onChange={handleChange}
                        required
                    ></textarea>

                    <label className="product-label">Product Image</label>
                    <input
                        type="file"
                        className="product-input"
                        onChange={handleFileChange}
                    />
                    {previewImage && (
                        <img
                            src={previewImage}
                            alt="Preview"
                            className="preview-image"
                        />
                    )}

                    {error && <p className="error-message">{error}</p>}

                    <div className="product-buttons">
                        <button type="submit" className="btn-primary">
                            Create Product
                        </button>
                        <button
                            type="button"
                            className="btn-secondary"
                            onClick={() => navigate("/products")}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateProduct;

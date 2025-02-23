import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProductList from './components/products/ProductList';
import CreateProduct from './components/products/CreateProduct';
import EditProduct from './components/products/EditProduct';
import Navbar from "./components/Navbar";
import Logout from "./components/Logout";
import Signup from "./components/Signup";
import Login from "./components/Login"; 
import Home from "./components/Home";
import ProtectedRoute from "./components/ProtectedRoute";
import CategoryList from "./pages/CategoryList";
import CreateCategory from "./pages/CreateCategory";
import EditCategory from "./pages/EditCategory";
import Sidebar from "./components/Sidebar";
import axios from "axios";
import Dashboard from "./components/Dashboard";

function App() {
    const isLoggedIn = !!localStorage.getItem("user"); // Vérifie si l'utilisateur est connecté
    const [products, setProducts] = useState([]); // État pour les produits
    const [viewMode, setViewMode] = useState("table"); // ✅ Mode d'affichage : "table" ou "cards"

    // Récupérer la liste des produits
    useEffect(() => {
        axios
            .get("http://localhost:8080/api/products")
            .then((response) => setProducts(response.data))
            .catch((error) => console.error("Error fetching products:", error));
    }, []);

    // Fonction pour télécharger le fichier CSV
    const downloadCSV = () => {
        if (products.length === 0) {
            alert("No products available to download.");
            return;
        }

        const csvContent = [
            ["ID", "Name", "Brand", "Category", "Price (MAD)", "Stock", "Image URL"],
            ...products.map((p) => [
                p.id,
                p.name,
                p.brand,
                p.category,
                p.price,
                p.stock,
                `http://localhost:8080/images/${p.imageFileName}`,
            ]),
        ]
        .map((e) => e.join(","))
        .join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.setAttribute("download", "products_list.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <Router>
            <Navbar onDownloadCSV={downloadCSV} />
            <div className="app-container">
                {isLoggedIn && <Sidebar viewMode={viewMode} setViewMode={setViewMode} />} 
                <div className="container mt-4">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/signup" element={<Signup />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/logout" element={<Logout />} />
                        {/* 🔒 Pages protégées */}
                        <Route path="/products" element={<ProtectedRoute><ProductList viewMode={viewMode} /></ProtectedRoute>} />
                        <Route path="/products/create" element={<ProtectedRoute><CreateProduct /></ProtectedRoute>} />
                        <Route path="/products/edit/:id" element={<ProtectedRoute><EditProduct /></ProtectedRoute>} />
                        <Route path="/categories" element={<CategoryList viewMode={viewMode} />} />
                        <Route path="/categories/create" element={<CreateCategory />} />
                        <Route path="/categories/edit/:id" element={<EditCategory />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default App;

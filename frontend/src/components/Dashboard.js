import React, { useEffect, useState } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line, Legend } from "recharts";
import { ShoppingCart, Package, TrendingUp, Archive } from "lucide-react";
import Sidebar from "./Sidebar";
import "./Dashboard.css";

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [totalSales, setTotalSales] = useState(0);
  const [totalStock, setTotalStock] = useState(0);
  const [initialTotalStock, setInitialTotalStock] = useState(0);
  const [darkMode, setDarkMode] = useState(false); // l'état pour le mode sombre

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/products")
      .then((response) => {
        const data = response.data;
        setProducts(data);

        const sales = data.reduce(
          (sum, product) =>
            sum + (product.initialStock - product.stock) * product.price,
          0
        );
        setTotalSales(sales);

        const stock = data.reduce((sum, product) => sum + product.stock, 0);
        setTotalStock(stock);

        const initialStock = data.reduce(
          (sum, product) => sum + product.initialStock,
          0
        );
        setInitialTotalStock(initialStock);
      })
      .catch((error) => console.error("Error fetching products:", error));
  }, []);

  const salesData = products.map((p) => ({
    name: p.name,
    sales: (p.initialStock - p.stock) * p.price,
  }));

  const stockData = products.map((p) => ({
    name: p.name,
    stock: p.stock,
    initialStock: p.initialStock,
  }));



  return (
    <div className={`dashboard-container ${darkMode ? "dark-mode" : ""}`}>
      <Sidebar />
      <div className="dashboard-content">
        <h1>📊 Dashboard</h1>
        

        <div className="stats-container">
          <div className="stat-card">
            <ShoppingCart size={30} />
            <h2>Total Sales</h2>
            <p>MAD {totalSales.toLocaleString()}</p>
          </div>

          <div className="stat-card">
            <Package size={30} />
            <h2>Products in Stock</h2>
            <p>{totalStock} Items</p>
          </div>

          <div className="stat-card">
            <Archive size={30} />
            <h2>Initial Stock</h2>
            <p>{initialTotalStock} Items</p>
          </div>

          <div className="stat-card">
            <TrendingUp size={30} />
            <h2>Sold Products</h2>
            <p>{initialTotalStock - totalStock} Items</p>
          </div>
        </div>

        <div className="charts-container">
          <div className="chart">
            <h3>📈 Sales by Product</h3>
            <BarChart width={500} height={300} data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="sales" fill="#4CAF50" />
            </BarChart>
          </div>

          <div className="chart">
            <h3>📦 Stock vs Initial Stock</h3>
            <LineChart width={500} height={300} data={stockData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="stock" stroke="#007bff" />
              <Line
                type="monotone"
                dataKey="initialStock"
                stroke="#ff7300"
                strokeDasharray="5 5"
              />
            </LineChart>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

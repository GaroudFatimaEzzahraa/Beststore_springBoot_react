import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faBoxOpen, 
  faLayerGroup, 
  faThLarge, 
  faTable, 
  faSignOutAlt, 
  faChartBar 
} from "@fortawesome/free-solid-svg-icons";
import "./Sidebar.css";

const Sidebar = ({ viewMode, setViewMode }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
    window.location.reload();
  };

  return (
    <div className="sidebar">
      <h2>BestStore</h2>

      {/* ✅ Lien vers le Dashboard */}
      <div className="sidebar-item">
        <Link to="/dashboard" className="btn-manage">
          <FontAwesomeIcon icon={faChartBar} /> Dashboard
        </Link>
      </div>

      <div className="sidebar-item">
        <Link to="/products" className="btn-manage">
          <FontAwesomeIcon icon={faBoxOpen} /> View Products
        </Link>
      </div>

      <div className="sidebar-item">
        <Link to="/categories" className="btn-manage">
          <FontAwesomeIcon icon={faLayerGroup} /> Manage Categories
        </Link>
      </div>

      {/* ✅ Toggle Cards/Table View */}
      <div className="sidebar-item">
        <button
          className="btn-toggle-view"
          onClick={() => setViewMode(viewMode === "table" ? "cards" : "table")}
        >
          <FontAwesomeIcon icon={viewMode === "table" ? faThLarge : faTable} />{" "}
          {viewMode === "table" ? "Cards View" : "Table View"}
        </button>
      </div>

      {/* 🔴 Bouton Logout */}
      <div className="sidebar-item">
        <button className="btn-logout" onClick={handleLogout}>
          <FontAwesomeIcon icon={faSignOutAlt} /> Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

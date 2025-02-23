import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faSignInAlt, faUserPlus, faMoon, faSun, faDownload } from "@fortawesome/free-solid-svg-icons";
import "bootstrap/dist/css/bootstrap.min.css";

const Navbar = ({ onDownloadCSV }) => {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(localStorage.getItem("darkMode") === "true");

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
    document.body.className = darkMode ? "dark-mode" : "light-mode";
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    localStorage.setItem("darkMode", !darkMode);
    document.body.className = !darkMode ? "dark-mode" : "light-mode";
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" to="/">BestStore</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item"><Link className="nav-link" to="/"><FontAwesomeIcon icon={faHome} /> Home</Link></li>

            {!user ? (
              <>
                <li className="nav-item"><Link className="nav-link" to="/login"><FontAwesomeIcon icon={faSignInAlt} /> Login</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/signup"><FontAwesomeIcon icon={faUserPlus} /> Signup</Link></li>
              </>
            ) : null}

            {location.pathname === "/products" && (
              <li className="nav-item">
                <button className="nav-link btn btn-dark" onClick={onDownloadCSV}>
                  <FontAwesomeIcon icon={faDownload} /> Download CSV
                </button>
              </li>
            )}

            <li className="nav-item">
              <button className="nav-link btn btn-dark" onClick={toggleDarkMode}>
                <FontAwesomeIcon icon={darkMode ? faSun : faMoon} /> {darkMode ? "Light Mode" : "Dark Mode"}
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

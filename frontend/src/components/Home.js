import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Database, Shield, TrendingUp, Headset, PieChart } from "lucide-react";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleButtonClick = () => {
    if (user) {
      navigate("/dashboard"); // 🔥 Si connecté, va au Dashboard
    } else {
      navigate("/login"); // 🔥 Sinon, va à la page de connexion
    }
  };

  return (
    <div className="home-container">
      {/* Image en haut avec overlay */}
      <div className="top-image-container">
        <img src="/images/gestion2.jpg" alt="Inventory Management" className="top-image" />
        <div className="overlay-content">
          <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
            Welcome to <span className="highlight">BestStore</span>!
          </motion.h1>
          <p className="hero-text">
            Your all-in-one solution for managing and tracking your products efficiently. 
            Start <strong>optimizing your inventory</strong> today!
          </p>

          <motion.button 
            className="cta-button" 
            onClick={handleButtonClick} 
            whileHover={{ scale: 1.1 }}
          >
            {user ? "Go to Dashboard" : "Login to Get Started"}
          </motion.button>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="why-choose-section">
        <h2>Why Choose BestStore?</h2>
        <div className="feature-grid">
          {[
            { icon: <Database className="feature-icon" />, title: "Easy to Use", description: "Intuitive interface designed for maximum efficiency." },
            { icon: <Shield className="feature-icon" />, title: "Secure", description: "Your data is protected with enterprise-grade security." },
            { icon: <TrendingUp className="feature-icon" />, title: "Scalable", description: "Grows with your business, from startup to enterprise." },
            { icon: <Headset className="feature-icon" />, title: "24/7 Support", description: "We are always here to help you with any issues." },
            { icon: <PieChart className="feature-icon" />, title: "Advanced Analytics", description: "Track your sales and inventory with detailed insights." },
          ].map((feature, index) => (
            <motion.div key={index} className="feature-card" whileHover={{ scale: 1.05 }}>
              {feature.icon}
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* About Us Section */}
      <div className="about-section">
        <h2>About Us</h2>
        <p>
          BestStore is your trusted partner in inventory management. We provide <strong>cutting-edge solutions</strong> to help businesses of all sizes streamline their operations,
          reduce costs, and grow efficiently. Our platform is designed with <strong>simplicity and effectiveness</strong> in mind.
        </p>
      </div>
    </div>
  );
};

export default Home;

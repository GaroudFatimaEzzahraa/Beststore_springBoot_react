import React from "react";

function Logout() {
    const handleLogout = () => {
        localStorage.removeItem("user");
        alert("Logged out successfully");
    };

    return <button onClick={handleLogout}>Logout</button>;
}

export default Logout;

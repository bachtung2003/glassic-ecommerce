import React from "react";
import "./Navbar.css";
import navAdminLogo from "../../assets/img/admin-logo.svg";

const Navbar = () => {
  return (
    <div className="navbar">
      <h1 className="nav-logo">GLASSIC</h1>
      <img src={navAdminLogo} className="nav-profile" alt="" />
    </div>
  );
};

export default Navbar;

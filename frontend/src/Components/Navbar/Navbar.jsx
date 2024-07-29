import React, { useState, useEffect, useRef, useContext } from "react";
import "./Navbar.css";
import menu from "../../Assets/img/menu.png";
import cart from "../../Assets/img/cart.png";
import { useSearchParams, Link } from "react-router-dom";
import { ShopContext } from "../../Context/ShopContext";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  let menuRef = useRef();
  const { cartItems, setCartItems } = useContext(ShopContext);
  return (
    <div className="navbar">
      <div className="menu" ref={menuRef}>
        <div
          className="menu-trigger"
          onClick={() => {
            setOpen(!open);
          }}
        >
          <img src={menu} id="img-1" />
        </div>
        <div className={`dropdown-menu ${open ? "active" : "inactive"}`}>
          <ul>
            <Link
              style={{ textDecoration: "none", color: "inherit" }}
              to="/about-us"
            >
              <DropdownItem text={"ABOUT US"} />
            </Link>
            <Link
              style={{ textDecoration: "none", color: "inherit" }}
              to="/products"
            >
              <DropdownItem text={"PRODUCTS"} />
            </Link>
            <Link
              style={{ textDecoration: "none", color: "inherit" }}
              to="/stores"
            >
              <DropdownItem text={"STORES"} />
            </Link>
            <Link
              style={{ textDecoration: "none", color: "inherit" }}
              to="/services"
            >
              <DropdownItem text={"SERVICES"} />
            </Link>
          </ul>
        </div>
      </div>
      <div className="logo">
        <Link style={{ textDecoration: "none", color: "inherit" }} to="/">
          GLASSIC
        </Link>
      </div>
      <div className="right-bar">
        {localStorage.getItem("auth-token") ? (
          <div
            className="logout"
            onClick={() => {
              localStorage.removeItem("auth-token");
              window.location.replace("/");
            }}
          >
            Logout
          </div>
        ) : (
          <div className="login">
            <Link
              style={{ textDecoration: "none", color: "inherit" }}
              to="/login"
            >
              Login
            </Link>
          </div>
        )}

        <div className="cart">
          <Link
            style={{ textDecoration: "none", color: "inherit" }}
            to="/cart-page"
          >
            <img src={cart} id="img-2" />
          </Link>
          <div className="nav-cart-count">{cartItems.length}</div>
        </div>
      </div>
    </div>
  );
  function DropdownItem(props) {
    const handleItemClick = () => {
      setOpen(false);
    };
    return (
      <li className="dropdownItem" onClick={handleItemClick}>
        <span> {props.text}</span>
      </li>
    );
  }
};

export default Navbar;

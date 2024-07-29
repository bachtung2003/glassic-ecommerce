import React from "react";
import "./Sidebar.css";
import { Link } from "react-router-dom";
import add_product_icon from "../../assets/img/add-product.svg";
import list_product_icon from "../../assets/img/list-product.svg";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <Link
        to={"/addproduct"}
        style={{ textDecoration: "none", color: "inherit" }}
      >
        <div className="sidebar-item">
          <img src={add_product_icon} alt="" />
          <p>Add product</p>
        </div>
      </Link>
      <Link
        to={"/listproduct"}
        style={{ textDecoration: "none", color: "inherit" }}
      >
        <div className="sidebar-item">
          <img src={list_product_icon} alt="" />
          <p>Product list</p>
        </div>
      </Link>
    </div>
  );
};

export default Sidebar;
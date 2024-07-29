import React, { useContext } from "react";
import "./ProductCategory.css";
import data from "../../Assets/Product/all_product.js";
import { ShopContext } from "../../Context/ShopContext.jsx";

const ProductCategory = ({
  filterItem,
  setItem,
  menuItems,
  setProducts,
  selectedCategory,
  setSelectedCategory,
}) => {
  const { allProducts } = useContext(ShopContext);
  return (
    <>
      <div className="widget-header">
        <h5 className="title">All Categories</h5>
      </div>
      <div className="filter-option">
        <button
          onClick={() => {
            setProducts(allProducts);
            setSelectedCategory("ALL");
          }}
          className={`m-2 ${selectedCategory === "ALL" ? "bg-warning" : ""}`}
        >
          ALL
        </button>
        {menuItems.map((Val, id) => {
          return (
            <button
              className={`m-2 ${selectedCategory === Val ? "bg-warning" : ""}`}
              key={id}
              onClick={() => filterItem(Val)}
            >
              {Val.toUpperCase()}
            </button>
          );
        })}
      </div>
    </>
  );
};

export default ProductCategory;

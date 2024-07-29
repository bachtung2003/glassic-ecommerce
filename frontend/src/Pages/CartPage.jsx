import React, { useContext, useEffect, useState } from "react";
import "./css/CartPage.css";
import { ShopContext } from "../Context/ShopContext";

const CartPage = () => {
  const {
    cartItems,
    setCartItems,
    calculateTotalPrice,
    handleIncrease,
    handleDecrease,
    handleRemoveItem,
    cartSubtotal,
    orderTotal,
  } = useContext(ShopContext);

  // useEffect(() => {
  //   const storeCartItems = JSON.parse(localStorage.getItem("cart")) || [];
  //   setCartItems(storeCartItems);
  // }, []);

  return (
    <div>
      <div className="contentswrap cart_wrapper">
        <div className="center_wrap">
          <div className="content_cart_items">
            <p className="header_cart_items">Shopping Bag</p>
            <div className="list_wrap">
              <div className="head">
                <p className="product">Product</p>
                <p className="quantity"> </p>
                <p className="price">Price</p>
              </div>
              <div className="items-wrap">
                <table id="cart-item-table">
                  <tbody>
                    {cartItems.map((item, index) => (
                      <tr key={index} className="cart-item">
                        <td className="item-img">
                          <a className="cursor_p" href="./products/1">
                            <img src={item.img} alt="" />
                          </a>
                        </td>
                        <td className="name-item">
                          <p className="name">{item.name}</p>
                          <p className="price">
                            {item.price.toLocaleString("en-US")}đ
                          </p>
                          <div className="etc-item">
                            <div className="field">
                              <button onClick={() => handleDecrease(item)}>
                                -
                              </button>
                              <input
                                type="number"
                                value={item.quantity}
                                readOnly
                                min={1}
                                max={50}
                              />
                              <button onClick={() => handleIncrease(item)}>
                                +
                              </button>
                            </div>
                          </div>
                        </td>
                        <td className="num-item">
                          <p className="text-r">
                            <span className="cart-item-total-price">
                              {calculateTotalPrice(item).toLocaleString(
                                "en-US"
                              )}
                              đ
                            </span>
                          </p>
                          <p
                            onClick={() => handleRemoveItem(item)}
                            className="btn-r"
                          >
                            <span className="delete-btn">Delete</span>
                          </p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <aside className="cart-side-content">
            <p className="header_cart_side_content">Order Detail</p>
            <ul className="checkout-summary">
              <li className="subtotal">
                <span className="title">Subtotal</span>
                <span className="value">
                  {cartSubtotal.toLocaleString("en-US")}đ
                </span>
              </li>
              <li className="standard-shipping">
                <span className="title">Standard Shipping</span>
                <span className="value">Free</span>
              </li>
              <li className="duties">
                <span className="title">Duties</span>
                <span className="value">Calculated at Checkout</span>
              </li>
              <li className="total">
                <span className="title">Total</span>
                <span className="value">
                  {orderTotal.toLocaleString("en-US")}đ
                </span>
              </li>
            </ul>
            <div className="cart-action">
              <button type="button" className="checkout-btn">
                Checkout
              </button>
              <a href="/products" className="continue-shopping-btn">
                Continue Shopping
              </a>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default CartPage;

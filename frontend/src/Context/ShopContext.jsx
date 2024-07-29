import React, { createContext, useEffect, useState } from "react";

export const ShopContext = createContext(null);

const ShopContextProvider = (props) => {
  const [cartItems, setCartItems] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:4000/allproducts")
      .then((resp) => resp.json())
      .then((data) => {
        setAllProducts(data);
        setLoading(false);
      });

    // const storeCartItems = JSON.parse(localStorage.getItem("cart")) || [];
    // setCartItems(storeCartItems);
    if (localStorage.getItem("auth-token")) {
      fetch("http://localhost:4000/getcart", {
        method: "POST",
        headers: {
          Accept: "application/form-data",
          "auth-token": `${localStorage.getItem("auth-token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      })
        .then((resp) => resp.json())
        .then((data) => setCartItems(data.cart));
    }
  }, []);

  // calculate prices
  const calculateTotalPrice = (item) => {
    return item.price * item.quantity;
  };

  const handleIncrease = (item) => {
    if (item.quantity < 5) {
      item.quantity += 1;
      setCartItems([...cartItems]);
      localStorage.setItem("cart", JSON.stringify(cartItems));
    }
    if (localStorage.getItem("auth-token")) {
      fetch("http://localhost:4000/addtocart", {
        method: "POST",
        headers: {
          Accept: "application/form-data",
          "auth-token": `${localStorage.getItem("auth-token")}`,
          "Content-Type": "application/json",
        },
        // prettier-ignore
        body: JSON.stringify({ "itemId": item.id }),
      })
        .then((resp) => resp.json())
        .then((data) => console.log(data));
    }
  };

  const handleDecrease = (item) => {
    if (item.quantity > 1) {
      item.quantity -= 1;
      setCartItems([...cartItems]);
      localStorage.setItem("cart", JSON.stringify(cartItems));
    }
    if (localStorage.getItem("auth-token")) {
      fetch("http://localhost:4000/removesingle", {
        method: "POST",
        headers: {
          Accept: "application/form-data",
          "auth-token": `${localStorage.getItem("auth-token")}`,
          "Content-Type": "application/json",
        },
        // prettier-ignore
        body: JSON.stringify({ "itemId": item.id }),
      })
        .then((resp) => resp.json())
        .then((data) => console.log(data));
    }
  };

  const handleRemoveItem = (item) => {
    const updatedCart = cartItems.filter((cartItem) => cartItem.id !== item.id);
    setCartItems(updatedCart);
    updateLocalStorage(updatedCart);
    if (localStorage.getItem("auth-token")) {
      fetch("http://localhost:4000/removefromcart", {
        method: "POST",
        headers: {
          Accept: "application/form-data",
          "auth-token": `${localStorage.getItem("auth-token")}`,
          "Content-Type": "application/json",
        },
        // prettier-ignore
        body: JSON.stringify({ "itemId": item.id }),
      })
        .then((resp) => resp.json())
        .then((data) => console.log(data));
    }
  };

  const updateLocalStorage = (cart) => {
    localStorage.setItem("cart", JSON.stringify(cart));
  };

  // cart subtotal
  const cartSubtotal = cartItems.reduce((total, item) => {
    return total + calculateTotalPrice(item);
  }, 0);

  // orders total
  const orderTotal = cartSubtotal;

  const contextValue = {
    allProducts,
    cartItems,
    setCartItems,
    calculateTotalPrice,
    handleIncrease,
    handleDecrease,
    handleRemoveItem,
    cartSubtotal,
    orderTotal,
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;

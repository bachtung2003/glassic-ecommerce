import React, { useState } from "react";
import "./AddProduct.css";
import upload_area from "../../assets/img/upload-img.svg";

const AddProduct = () => {
  const [thumbImage, setThumbImage] = useState(null);
  const [archiveImage, setArchiveImage] = useState([]);
  const [productDetails, setProductDetails] = useState({
    name: "",
    image: "",
    images: [],
    category: "rayban",
    price: "",
  });

  const thumbImageHandler = (e) => {
    setThumbImage(e.target.files[0]);
  };

  const archiveImageHandler = (e) => {
    setArchiveImage([...e.target.files]);
  };

  const changeHandler = (e) => {
    setProductDetails({ ...productDetails, [e.target.name]: e.target.value });
  };

  const Add_Product = async () => {
    let responseData;
    let formData = new FormData();
    let product = productDetails;
    // Append the thumbnail image
    if (thumbImage) {
      formData.append("thumbImgFile", thumbImage);
    }

    // Append multiple archive images
    archiveImage.forEach((image) => {
      formData.append("archiveImgFiles", image);
    });

    await fetch("http://localhost:4000/upload", {
      method: "POST",
      body: formData,
    })
      .then((resp) => resp.json())
      .then((data) => {
        responseData = data;
      })
      .catch((error) => {
        console.error("Error uploading files:", error);
      });

    if (responseData && responseData.success) {
      const images = responseData.archiveImgFiles.map((url) => ({ img: url }));

      product.image = responseData.thumbImgFile;
      product.images = images;
      console.log(productDetails);
      await fetch("http://localhost:4000/addproduct", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      })
        .then((resp) => resp.json())
        .then((data) => {
          data.success ? alert("Product Added") : alert("Failed");
        });
    }
  };

  return (
    <div className="add-product">
      <div className="addproduct-itemfield">
        <p>Product Title</p>
        <input
          value={productDetails.name}
          onChange={changeHandler}
          type="text"
          name="name"
          placeholder="Type here"
        />
      </div>
      <div className="addproduct-itemfield">
        <p>Price</p>
        <input
          value={productDetails.price}
          onChange={changeHandler}
          type="text"
          name="price"
          placeholder="Type here"
        />
      </div>
      <div className="addproduct-itemfield">
        <p>Product Category</p>
        <select
          value={productDetails.category}
          onChange={changeHandler}
          name="category"
          className="add-product-selector"
        >
          <option value="rayban">rayban</option>
          <option value="guess">guess</option>
          <option value="versace">versace</option>
          <option value="d&g">dolce&gabbana</option>
        </select>
      </div>
      <div className="addproduct-upload-img">
        <div className="addproduct-itemfield">
          <p>Thumbnail Image</p>
          <label htmlFor="file-input">
            <img
              src={thumbImage ? URL.createObjectURL(thumbImage) : upload_area}
              className="addproduct-img"
              alt=""
            />
          </label>
          <input
            onChange={thumbImageHandler}
            type="file"
            name="image"
            id="file-input"
            hidden
          />
        </div>
        <div className="addproduct-itemfield">
          <p>Archive Images</p>
          <input
            onChange={archiveImageHandler}
            type="file"
            name="images"
            id="multiple-file-input"
            multiple
          />
        </div>
      </div>

      <button
        onClick={() => {
          Add_Product();
        }}
        className="addproduct-btn"
      >
        ADD
      </button>
    </div>
  );
};

export default AddProduct;

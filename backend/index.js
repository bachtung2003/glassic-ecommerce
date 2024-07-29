const port = 4000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const { error, log } = require("console");
const { stringify } = require("querystring");
const { type } = require("os");

app.use(express.json());
app.use(cors());

// Database Connection With MongoDB
mongoose.connect(
  "mongodb+srv://tranbachtungnvc:dotgh123@cluster0.1k0oeav.mongodb.net/glasses+e-commerce"
);

// API Creation
app.get("/", (req, res) => {
  res.send("Express App is Running");
});

// Creating Upload Endpoint for Images
app.use("/thumb-imgs", express.static("upload/images/thumb-imgs"));
app.use("/archive-imgs", express.static("upload/images/archive-imgs"));

// Initialize Upload
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      if (file.fieldname === "thumbImgFile") {
        cb(null, "./upload/images/thumb-imgs");
      } else if (file.fieldname === "archiveImgFiles") {
        cb(null, "./upload/images/archive-imgs");
      }
    },
    filename: (req, file, cb) => {
      cb(
        null,
        `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
      );
    },
  }),
});

// Handle the upload
app.post(
  "/upload",
  upload.fields([
    { name: "thumbImgFile", maxCount: 1 },
    { name: "archiveImgFiles", maxCount: 10 },
  ]),
  (req, res) => {
    if (!req.files) {
      return res.status(400).json({
        success: 0,
        message: "No files uploaded.",
      });
    }

    const thumbImgFileInfo = req.files.thumbImgFile
      ? `http://localhost:${port}/thumb-imgs/${req.files.thumbImgFile[0].filename}`
      : null;

    const archiveImgFilesInfo = req.files.archiveImgFiles
      ? req.files.archiveImgFiles.map(
          (file) => `http://localhost:${port}/archive-imgs/${file.filename}`
        )
      : [];

    res.json({
      success: 1,
      thumbImgFile: thumbImgFileInfo,
      archiveImgFiles: archiveImgFilesInfo,
    });
  }
);

// Schema for Creating Products
const Product = mongoose.model("Product", {
  id: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  images: [
    {
      img: String,
    },
  ],
  category: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

// Creating API for Adding Products
app.post("/addproduct", async (req, res) => {
  let products = await Product.find({});
  let id;
  if (products.length > 0) {
    let last_product_array = products.slice(-1);
    let last_product = last_product_array[0];
    id = last_product.id + 1;
  } else {
    id = 1;
  }
  const product = new Product({
    id: id,
    name: req.body.name,
    image: req.body.image,
    images: req.body.images,
    category: req.body.category,
    price: req.body.price,
  });
  console.log(product);
  await product.save();
  console.log("Saved");
  res.json({
    success: true,
    name: req.body.name,
  });
});

// Creating API for Deleting Products
app.post("/removeproduct", async (req, res) => {
  await Product.findOneAndDelete({ id: req.body.id });
  console.log("Removed");
  res.json({
    success: true,
    name: req.body.name,
  });
});

// Creating API for Getting all Products
app.get("/allproducts", async (req, res) => {
  let products = await Product.find({});
  console.log("All Products Fetched");
  res.send(products);
});

// Schema for Creating User Model
const Users = mongoose.model("Users", {
  name: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
  cartData: {
    type: Object,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

// Creating Endpoint for Registering the user
app.post("/signup", async (req, res) => {
  let check = await Users.findOne({ email: req.body.email });
  if (check) {
    return res.status(400).json({
      success: false,
      errors: "existing user found with same email address",
    });
  }
  let cart = {};
  for (let i = 0; i < 300; i++) {
    cart[i] = 0;
  }
  const user = new Users({
    name: req.body.username,
    email: req.body.email,
    password: req.body.password,
    cartData: cart,
  });
  await user.save();

  const data = {
    user: {
      id: user.id,
    },
  };
  const token = jwt.sign(data, "secret_ecom");
  res.json({ success: true, token });
});

// Creating Endpoint for User Login
app.post("/login", async (req, res) => {
  let user = await Users.findOne({ email: req.body.email });
  if (user) {
    const passCompare = req.body.password === user.password;
    if (passCompare) {
      const data = {
        user: {
          id: user.id,
        },
      };
      const token = jwt.sign(data, "secret_ecom");
      res.json({ success: true, token });
    } else {
      res.json({ success: false, errors: "wrong password" });
    }
  } else {
    res.json({ success: false, errors: "wrong email id" });
  }
});

// Creating Middleware to Fetch User
const fetchUser = async (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) {
    res.status(401).send({ errors: "Please authenticate using valid token" });
  } else {
    try {
      const data = jwt.verify(token, "secret_ecom");
      req.user = data.user;
      next();
    } catch (error) {
      res.status(401).send({ errors: "Please authenticate using valid token" });
    }
  }
};

// Creating Endpoint for Adding Products in cartData
app.post("/addtocart", fetchUser, async (req, res) => {
  let userData = await Users.findOne({ _id: req.user.id });
  if (userData.cartData[req.body.itemId] < 5)
    userData.cartData[req.body.itemId] += 1;
  await Users.findOneAndUpdate(
    { _id: req.user.id },
    { cartData: userData.cartData }
  );
  res.json("Added");
});

// Creating Endpoint for Delete Products in cartData
app.post("/removefromcart", fetchUser, async (req, res) => {
  let userData = await Users.findOne({ _id: req.user.id });
  if (userData.cartData[req.body.itemId] > 0)
    userData.cartData[req.body.itemId] = 0;
  await Users.findOneAndUpdate(
    { _id: req.user.id },
    { cartData: userData.cartData }
  );
  res.json("Removed");
});

// Creating Endpoint for increasing Products in cartData
app.post("/removesingle", fetchUser, async (req, res) => {
  let userData = await Users.findOne({ _id: req.user.id });
  if (userData.cartData[req.body.itemId] > 1)
    userData.cartData[req.body.itemId] -= 1;
  await Users.findOneAndUpdate(
    { _id: req.user.id },
    { cartData: userData.cartData }
  );
  res.json("Decreased quantity");
});

// Creating Endpoint to Get cartData
app.post("/getcart", fetchUser, async (req, res) => {
  try {
    // Find user by ID
    let userData = await Users.findOne({ _id: req.user.id });
    let productIds = [];
    // Extract product IDs and their quantities from the cartData
    let cartItems = userData.cartData;
    for (let i = 0; i < 300; i++) {
      if (cartItems[i] > 0) {
        productIds.push(i);
      }
    }
    // Fetch product details for the items in the cart
    let products = await Product.find({ id: { $in: productIds } });

    // Combine product details with cart quantities
    let cartDetails = products.map((product) => ({
      id: product.id,
      name: product.name,
      img: product.image,
      price: product.price,
      quantity: cartItems[product.id],
    }));

    res.json({
      success: true,
      cart: cartDetails,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

app.listen(port, (error) => {
  if (!error) {
    console.log("Server Running on Port " + port);
  } else {
    console.log("Error " + error);
  }
});

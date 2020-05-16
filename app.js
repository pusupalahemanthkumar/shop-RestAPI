// Importing The Packages In NodeJS
const path=require("path");
const express = require("express");
const bodyParser=require("body-parser");
const mongoose=require("mongoose");
const morgan = require("morgan");
// Importing The Required Files Here
const productRoutes = require("./api/routes/products");
const orderRoutes = require("./api/routes/orders");
const userRoutes=require("./api/routes/users");
// Initialising  The Express App Here
const app = express();
// We Are Adding The Middleware Here
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({
    extended:true
}));
app.use(bodyParser.json());
app.use('/uploads',express.static(path.join(__dirname,'uploads')));
// Setting The CROS Headers here ( to allow access from anywhere)
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept, Authorization');
    next();
});
//API routes
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use("/user",userRoutes);
// Page NOT Found Route
app.use((req, res, next) => {
  const error = new Error("NOT FOUNT 404");
  error.status=404;
  next(error);
});
// Error Handling Route
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

module.exports = app;

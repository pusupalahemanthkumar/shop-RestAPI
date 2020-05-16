// Importing Packages In NodeJS
const http = require("http");
const mongoose = require("mongoose");

// Importing The Required Files Here
const app = require("./app");

//Setting The Port Number Here
const port = process.env.PORT || 3000;

// Creating The Server Here
const server = http.createServer(app);

//Connecting To The Mongodb Database Here
mongoose
  .connect("Place Your MONGO_URI HERE")
  .then(() => {
    server.listen(port);
    console.log("connect..!");
  })
  .catch(err => {
    console.log(err);
  });

// Importing Packages here
const path = require("path");
const fs = require("fs");
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require("multer");

// Importing The Required Files here
const Product = require("../models/product");
const checkAuth=require("../middleware/check-auth");

// Multer Util function
const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  }
});
// Util Function For Checking file extensions here
function checkFileType(file, cb) {
  // Allowed Extension
  const filetypes = /jpg|jpeg|png|gif/;
  //Check Extension
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  //Check mimetype
  const mimetype = filetypes.test(file.mimetype);
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("ERROR : Invalid Data..!");
  }
}
// Initialising the multer here
const uploads = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  }
});
router.get("/", (req, res, next) => {
  Product.find()
    .select("name price _id productImage")
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        products: docs.map(doc => {
          return {
            name: doc.name,
            price: doc.price,
            productImage:doc.productImage,
            _id: doc._id,
            request: {
              type: "GET",
              url: "http://localhost:3000/products/" + doc._id
            }
          };
        })
      };
      //   if (docs.length >= 0) {
      res.status(200).json(response);
      //   } else {
      //       res.status(404).json({
      //           message: 'No entries found'
      //       });
      //   }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

router.post("/",checkAuth, uploads.single("productImage"), (req, res, next) => {
  console.log(req.file);
  const product = new Product({
    //_id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    productImage: `http://localhost:3000/uploads/${req.file.filename}`
  });
  product
    .save()
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: "Created product successfully",
        createdProduct: {
          name: result.name,
          price: result.price,
          _id: result._id,
          productImage:result.productImage,
          request: {
            type: "GET",
            url: "http://localhost:3000/products/" + result._id
          }
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

router.get("/:productId", (req, res, next) => {
  const id = req.params.productId;
  Product.findById(id)
    .select("name price _id productImage")
    .exec()
    .then(doc => {
      console.log("From database", doc);
      if (doc) {
        res.status(200).json({
          product: doc,
          request: {
            type: "GET",
            url: "http://localhost:3000/products"
          }
        });
      } else {
        res
          .status(404)
          .json({ message: "No valid entry found for provided ID" });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

router.patch("/:productId",checkAuth, (req, res, next) => {
  const id = req.params.productId;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Product.update({ _id: id }, { $set: updateOps })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Product updated",
        request: {
          type: "GET",
          url: "http://localhost:3000/products/" + id
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

router.delete("/:productId",checkAuth, (req, res, next) => {
  const id = req.params.productId;
  Product.remove({ _id: id })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Product deleted",
        request: {
          type: "POST",
          url: "http://localhost:3000/products",
          body: { name: "String", price: "Number" }
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

module.exports = router;

// const express = require("express");
// const Product = require("../models/product");
// const router = express.Router();

// router.get("/", (req, res, next) => {
//   Product.find()
//     .then(products => {
//       res.status(200).json({
//         message: "GET Request /products",
//         products: products
//       });
//     })
//     .catch(err => {
//       const e = new Error(err);
//       e.status = 500;
//       next(e);
//     });
// });

// router.post("/", (req, res, next) => {
//   const product = new Product({
//     name: req.body.name,
//     price: req.body.price
//   });
//   product
//     .save()
//     .then(result => {
//       res.status(201).json({
//         message: "POST Request /products",
//         createdProduct: result
//       });
//     })
//     .catch(err => {
//       console.log(err);
//     });
// });

// router.get("/:productId", (req, res, next) => {
//   const productId = req.params.productId;
//   Product.findById(productId)
//     .exec()
//     .then(doc => {
//       console.log(doc);
//       if (!doc) {
//         return res.status(200).json({
//           message: "NO PRODUCT FOUND..!"
//         });
//       }
//       res.status(200).json({
//         message: "GET Request (Fetched single  product ) /products",
//         product: doc
//       });
//     })
//     .catch(err => {
//       console.log(err);
//       next(err);
//     });
// });

// router.patch("/:productId", (req, res, next) => {
//   const productId = req.params.productId;
//   const name = req.body.name;
//   const price = req.body.price;
//   Product.findById(productId)
//     .then(product => {
//       if (!product) {
//         const err = new Error("NO product Found in database");
//         err.status = 422;
//         return next(err);
//       }
//       product.name = name;
//       product.price = price;
//       product
//         .save()
//         .then(result => {
//           res.status(200).json({
//             message: "Patch Request (updated product) /products",
//             productId: productId,
//             updatedProduct: result
//           });
//         })
//         .catch(err => {
//           console.log(err);
//           next(err);
//         });
//     })
//     .catch(err => {
//       console.log(err);
//       next(err);
//     });
// });

// router.delete("/:productId", (req, res, next) => {
//   const productId = req.params.productId;
//   Product.remove({ _id: productId }).exec()
//     .then(result=>{
//         res.status(200).json({
//             message: "delete Request(deleted product) /products",
//             productId: productId
//           });
//     })
//     .catch(err => {
//       console.log(err);
//     });
// });
// module.exports = router;

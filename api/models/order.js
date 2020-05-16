// Importing The Pacakges Here 
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Defining The Schema Here
const orderSchema = new Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product"
  },
  quantity: { type: Number, default: 1 }
});
// Exporting Modal Here
module.exports=mongoose.model('Order',orderSchema);
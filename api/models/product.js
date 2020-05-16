//Importing The Pacakges Here  
const mongoose=require("mongoose");
const Schema=mongoose.Schema;

// Defining The Schema Here
const productSchema=Schema({
    name:String,
    price:Number,
    productImage: { type: String, required: true }
});
// Exporting Modal Here
module.exports=mongoose.model('Product',productSchema);
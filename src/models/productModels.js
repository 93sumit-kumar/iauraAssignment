const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productDataSchema = new Schema({
   product_name: {
      type: String,
      required: true
   },
   price: {
      type: String,
      required: true
   },
   description: {
      type: String,
      required: false
   },
   display: {
      type: Number,
      default: 1
   }
});

const Product = mongoose.model('productData', productDataSchema);
module.exports = Product;

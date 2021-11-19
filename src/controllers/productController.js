const Product = require('../models/productModels');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { roles } = require('../roles');

exports.addProductForm = (req, res, next) => {
   try {
      res.render('addProduct');
   } catch (error) {
      next(error);
   }
};
/**
 * @description: Function to add the product
 */
exports.addProduct = async (req, res, next) => {
   try {
      const productName = req.body.productName;
      const price = req.body.price;
      const description = req.body.description;

      const newProduct = new Product({
         product_name: productName,
         price,
         description
      });
      const saveData = await newProduct.save();
      if (saveData) {
         res.send({
            statusCode: 200,
            message: 'Product added successfully!'
         });
      } else {
         res.send({
            statusCode: 401,
            message: 'Error! Something went wrong!'
         });
      }
   } catch (error) {
      next(error);
   }
};

/**
 * @description: Function to get all the products
 */
exports.viewProducts = async (req, res, next) => {
   try {
      const products = await Product.find({});
      res.render('getProducts', { records: products });
   } catch (error) {
      next(error);
   }
};
exports.getProducts = async (req, res, next) => {
   try {
      const products = await Product.find({});
      if (products) {
         //  res.send({
         //     statusCode: 200,
         //     message: 'All Products',
         //     data: products
         //  });
         res.render('getProducts', { records: products });
      } else {
         res.send({
            statusCode: 404,
            message: 'Product Not Found!',
            data: ''
         });
      }
   } catch (error) {}
};

/**
 * @description: Function to get single product
 */
exports.getProduct = async (req, res, next) => {
   try {
   } catch (error) {}
};

/**
 * @description: Function to update the product
 */
exports.updateProduct = async (req, res, next) => {
   try {
      const productId = req.params.productId;
      const updateData = req.body;
      const updatePro = Product.findByIdAndUpdate(productId, updateData);
      const updatedProduct = await Product.findById(productId);
      if (updatedProduct) {
         res.send({
            statusCode: 200,
            message: 'Product Update',
            data: updatedProduct
         });
      }
   } catch (error) {
      next(error);
   }
};

/**
 * @description: Function to delete the product
 */
exports.deleteProduct = async (req, res, next) => {
   try {
      const productId = req.params.productId;
      const deleteProduct = await Product.findByIdAndDelete(productId);
      if (deleteProduct) {
         res.send({
            statucCode: 200,
            message: 'User Deleted!'
         });
      }
   } catch (error) {
      next(error);
   }
};

const express = require('express');
const route = express();
const userController = require('../controllers/userController');
const productController = require('../controllers/productController');
var passport = require('passport'),
   LocalStrategy = require('passport-local').Strategy;

passport.authenticate('local', {
   successRedirect: '/',
   failureRedirect: '/login'
});

// route for signup
route.get('/signup', userController.signupForm);
route.post('/signup', userController.signup);

// route for logged in
route.get('/login', userController.loginForm);
route.post('/login', userController.login);

// route for get single user
route.get(
   '/user/:userId',
   userController.allowIfLoggedin,
   userController.getUser
);

// route for all users
route.get(
   '/users',
   userController.allowIfLoggedin,
   userController.grantAccess('readAny', 'Admin'),
   userController.getUsers
);

// route for update single user
route.put(
   '/user/:userId',
   userController.allowIfLoggedin,
   userController.grantAccess('updateAny', 'Admin'),
   userController.updateUser
);

// route for delete single user
route.delete(
   '/user/:userId',
   userController.allowIfLoggedin,
   userController.grantAccess('deleteAny', 'Admin'),
   userController.deleteUser
);

// route to load ejs add product form
route.get('/addProduct', productController.addProductForm);
// route to add new product
route.post('/addProduct', productController.addProduct);

// route to get all products
route.get('/getProducts', productController.viewProducts);
route.post(
   '/products',
   userController.allowIfLoggedin,
   userController.grantAccess('readOwn', 'User'),
   productController.getProducts
);

// route for update the product
route.put(
   '/product/:productId',
   userController.allowIfLoggedin,
   userController.grantAccess('updateAny', 'Admin'),
   productController.updateProduct
);

// route for Delete the product
route.delete(
   '/product/:productId',
   userController.allowIfLoggedin,
   userController.grantAccess('deleteAny', 'Admin'),
   productController.deleteProduct
);

// export the module
module.exports = route;

const User = require('../models/userModels');
const jwt = require('jsonwebtoken');
const localStorage = require('localStorage');
const bcrypt = require('bcrypt');
const { roles } = require('../roles');
var passport = require('passport'),
   LocalStrategy = require('passport-local').Strategy;

async function hashPasword(password) {
   return await bcrypt.hash(password, 10);
}
async function validatePassword(plainPassword, hashedPassword) {
   return await bcrypt.compare(plainPassword, hashedPassword);
}
exports.grantAccess = (action, resource) => {
   return async (req, res, next) => {
      try {
         console.log('ReqData: ', req);
         const permission = roles.can(req.user.role)[action](resource);
         if (!permission.granted) {
            res.send({
               statusCode: 401,
               message: "You don't have permission!"
            });
         }
         next();
      } catch (error) {
         next(error);
      }
   };
};

/**
 * @description: Login permission module
 */
exports.allowIfLoggedin = async (req, res, next) => {
   try {
      const user = res.locals.loggedInUser;
      if (!user) {
         res.send({
            statusCode: 401,
            message: 'You need to logged in first to acesss'
         });
      }
      req.user = user;
      next();
   } catch (error) {
      next(error);
   }
};

/**
 * @description: Signup module
 */
exports.signupForm = async (req, res, next) => {
   try {
      res.render('signup');
   } catch (error) {
      next(error);
   }
};
exports.signup = async (req, res, next) => {
   try {
      const username = req.body.username;
      const password = req.body.password;
      const role = req.body.role;
      console.log('Role ', role);
      if (role != 'Admin' && role != 'User') {
         res.send({
            statusCode: 403,
            message: 'Error! Invalid User Role '
         });
      }
      if (role === 'Admin') {
         res.send({
            statusCode: 403,
            message: 'Forbidden! Only One Admin Role Allowed'
         });
      }
      const hashedPassword = await hashPasword(password);
      const newUser = new User({
         username,
         password: hashedPassword,
         role: role || 'User'
      });
      const accessToken = jwt.sign(
         { userId: newUser._id },
         process.env.JWT_SECRET,
         { expiresIn: '1d' }
      );
      newUser.accessToken = accessToken;
      await newUser.save();
      res.send({
         statusCode: 200,
         message: 'User Created Successfully',
         accessToken
      });
   } catch (error) {
      next(error);
   }
};

/**
 * @description: login method
 */
exports.loginForm = async (req, res, next) => {
   try {
      res.render('login');
   } catch (error) {
      next(error);
   }
};
exports.login = async (req, res, next) => {
   try {
      const username = req.body.username;
      const password = req.body.password;

      const user = await User.findOne({ username });
      if (!user) {
         res.send({
            statusCode: 404,
            message: 'Username does not exists'
         });
      }
      const validPassword = await validatePassword(password, user.password);
      if (!validPassword) {
         res.send({
            statusCode: 404,
            message: 'Password is not mateced!'
         });
      }
      const accessToken = jwt.sign(
         { userId: user._id },
         process.env.JWT_SECRET,
         {
            expiresIn: '1d'
         }
      );
      localStorage.setItem('myLoginToken', accessToken);
      await User.findByIdAndUpdate(user._id, { accessToken });
      res.render('addProduct', { accessToken: accessToken });
      // res.send({
      //    statusCode: 200,
      //    message: 'User Found!',
      //    data: {
      //       username: user.username,
      //       role: user.role
      //    },
      //    accessToken
      // });
   } catch (error) {
      next(error);
   }
};
/**
 * @description: get users method
 */
exports.getUsers = async (req, res, next) => {
   const users = await User.find({});
   res.send({
      statusCode: 200,
      message: 'All users',
      data: users
   });
};

/**
 * @description: get single user
 */
exports.getUser = async (req, res, next) => {
   try {
      const userId = req.params.userId;
      const user = await User.findById(userId);
      if (!user) {
         res.send({
            statusCode: 200
         });
      }
   } catch (error) {}
};

/**
 * @description: update user
 */
exports.updateUser = async (req, res, next) => {
   try {
      const update = req.body;
      const userId = req.params.userId;
      await User.findByIdAndUpdate(userId, update);
      const user = await User.findById(userId);
      res.send({
         statusCode: 200,
         message: 'updated',
         data: user
      });
   } catch (error) {
      next(error);
   }
};

/**
 * @description: delete user
 */
exports.deleteUser = async (req, res, next) => {
   try {
      const userId = req.params.userId;
      await User.findByIdAndDelete(userId);
      res.send({
         statusCode: 200,
         message: 'User Deleted!'
      });
   } catch (error) {
      next(error);
   }
};

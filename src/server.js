const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const path = require('path');
const User = require('./models/userModels');
const routes = require('./routes/route');
const ejs = require('ejs');
require('dotenv').config({
   path: path.join(__dirname, '../.env')
});

const app = express();

// Set EJS as templating engine
app.set('view engine', 'ejs');

// Create server port
const PORT = process.env.PORT || 3000;

// Database connection
mongoose.connect('mongodb://127.0.0.1:27017/iaura').then(() => {
   console.log('Database connected!');
});

// body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * Passport Authenticate
 */
var passport = require('passport'),
   LocalStrategy = require('passport-local').Strategy;

passport.use(
   new LocalStrategy(function (username, password, done) {
      User.findOne({ username: username }, function (err, user) {
         if (err) {
            return done(err);
         }
         if (!user) {
            return done(null, false, { message: 'Incorrect username.' });
         }
         if (!user.validPassword(password)) {
            return done(null, false, { message: 'Incorrect password.' });
         }
         return done(null, user);
      });
   })
);
// create middleware route
app.use(async (req, res, next) => {
   if (req.body.access_token) {
      const accessToken = req.body.access_token;
      const { userId, exp } = await jwt.verify(
         accessToken,
         process.env.JWT_SECRET
      );

      // checking if token expired
      if (exp < Date.now().valueOf() / 1000) {
         res.send({
            statusCode: 401,
            message: 'JWT Token has been expired'
         });
      }
      res.locals.loggedInUser = await User.findById(userId);
      next();
   } else {
      next();
   }
});

// create Express Server
app.use('/', routes);
app.listen(PORT, () => {
   console.log('Server started at ', PORT);
});

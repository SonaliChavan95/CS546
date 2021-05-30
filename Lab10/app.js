const express = require('express');
const app = express();
const session = require('express-session');
const configRoutes = require('./routes');
const exphbs = require('express-handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.use(
  session({
    name: 'AuthCookie',
    secret: "some secret string!",
    saveUninitialized: true,
    resave: false
  })
);

// Authentication Middleware
app.use('/private', (req, res, next) => {
  if (!req.session.user) {
    res.render('error', {
      title: 'Forbidden client error',
      message: "The user is not logged in."
    });
  } else {
    next();
  }
});

// Logging Middleware
app.use(async (req, res, next) => {
  let authType = req.session.user ? "Authenticated" : "Non-Authenticated"
  console.log(`[${new Date().toUTCString()}]: ${req.method} ${req.originalUrl} (${authType} User)`);
  next();
});

configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const data = require('../data');
const userData = data.users;

router.get('/', async (req, res) => {
  if (req.session && req.session.user) {
    return res.redirect('/private');
  } else {
    res.render('auth/login', {
      title: 'Signin'
    });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = userData.getUserByName(username);
    let match = await bcrypt.compare(password, user.hashedPassword);
    if(match) {
      req.session.user = {
        _id: user._id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        profession: user.profession,
        bio: user.bio
      };
      res.redirect('/private');
    } else {
      res.status(401).render('auth/login', {
        title: 'Signin',
        error: 'Provide a valid username and/or password.'
      });
    }
  } catch (e) {
    res.status(401).render('auth/login', {
      title: 'Signin',
      error: e || 'Provide a valid username and/or password.'
    });
  }
});

router.get('/logout', async (req, res) => {
  req.session.destroy();
  res.render('error', {
    title: 'Logout',
    message: "You have been succesfully logged out of the application."
  });
});

module.exports = router;
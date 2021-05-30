const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  res.render('users/show', {
    title: req.session.user.username,
    user: req.session.user
  });
});

module.exports = router;
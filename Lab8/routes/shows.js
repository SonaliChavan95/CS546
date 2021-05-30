const express = require('express');
const router = express.Router();
const data = require('../data');
const showData = data.shows;

router.get('/:id', async (req, res) => {
  try {
    const show = await showData.getShowById(req.params.id);
    console.log(show);
    res.render('shows/single', { 
      show: show,
      title: show.name
    });
  } catch (e) {
    res.status(404).render('error', { 
      message: e || "TV Show is not found for given id",
      title: "404 Not Found"
    });
  }
});

module.exports = router;
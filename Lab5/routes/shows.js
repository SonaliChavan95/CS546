const express = require('express');
const router = express.Router();
const data = require('../data');
const showData = data.shows;

router.get('/:id', async (req, res) => {
  try {
    const show = await showData.getShowById(req.params.id);
    res.json(show);
  } catch (e) {
    res.status(404).json({ message: e.message || e || 'Show not found' });
  }
});

router.get('/', async (req, res) => {
  try {
    const showList = await showData.getAllShows();
    res.json(showList);
  } catch (e) {
    res.status(500).send();
  }
});

router.post('/', async (req, res) => {
  // Not implemented
  res.status(501).send();
});

router.delete('/', async (req, res) => {
  // Not implemented
  res.status(501).send();
});

module.exports = router;
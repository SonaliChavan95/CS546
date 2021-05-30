const express = require('express');
const router = express.Router();
const data = require('../data');
const reviewData = data.reviews;
const bookData = data.books;

router.get('/:id', async (req, res) => {
  try {
    let reviews = await reviewData.getAllreviews(req.params.id);
    res.json(reviews);
  } catch (e) {
    res.status(404).json({ error: e });
  }
});

router.get('/:bookId/:reviewId', async (req, res) => {
  try {
    let review = await reviewData.getReview(req.params.bookId, req.params.reviewId);
    res.json(review);
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

router.post('/:bookId', async (req, res) => {
  let reviewInfo = req.body;

  if (!reviewInfo) {
    res.status(400).json({ error: 'You must provide data to create a review' });
    return;
  }

  if (!reviewInfo.title) {
    res.status(400).json({ error: 'You must provide a title' });
    return;
  }

  if (!reviewInfo.reviewer) {
    res.status(400).json({ error: 'You must provide an reviewer' });
    return;
  }

  if (!reviewInfo.bookBeingReviewed || reviewInfo.bookBeingReviewed != req.params.bookId) {
    res.status(400).json({ error: 'You must provide a correct bookBeingReviewed value' });
    return;
  }

  if (!reviewInfo.rating) {
    res.status(400).json({ error: 'You must provide an rating' });
    return;
  }

  if (!reviewInfo.dateOfReview) {
    res.status(400).json({ error: 'You must provide an dateOfReview' });
    return;
  }

  if (!reviewInfo.review) {
    res.status(400).json({ error: 'You must provide an review' });
    return;
  }

  try {
    await bookData.getBookById(req.params.bookId);
    const newReview = await reviewData.create(
      reviewInfo.title,
      reviewInfo.reviewer,
      reviewInfo.bookBeingReviewed,
      reviewInfo.rating,
      reviewInfo.dateOfReview,
      reviewInfo.review
    );
    res.json(newReview);
  } catch (e) {
    res.status(500).json({error: e});
  }
});

router.delete('/:bookId/:reviewId', async (req, res) => {
  if (!req.params.reviewId) throw 'You must specify an ID to delete';
  try {
    await reviewData.getReview(req.params.bookId, req.params.reviewId);
  } catch (e) {
    res.status(404).json({ error: 'review not found' });
    return;
  }

  try {
    const deletedReview = await reviewData.remove(req.params.bookId, req.params.reviewId);
    res.status(200).json({reviewId: deletedReview._id.toString(), deleted: true});
  } catch (e) {
    res.status(500).json({error: e});
  }
});

module.exports = router;

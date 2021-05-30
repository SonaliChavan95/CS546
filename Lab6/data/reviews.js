const mongoCollections = require('../config/mongoCollections');
const reviews = mongoCollections.reviews;
const books = mongoCollections.books;
const bookData = require('./books');
const { ObjectId } = require('mongodb');

module.exports = {
  async getAllreviews(bookId) {
    if (!bookId) throw 'You must provide a book id to search for';
    if (typeof bookId != 'string' || bookId.trim().length === 0)
      throw 'You must provide a valid book Id to search for';
    await bookData.getBookById(bookId)

    const reviewCollection = await reviews();
    const reviewsList = await reviewCollection.find({ bookBeingReviewed: bookId }).toArray();
    if (reviewsList === null) throw 'No reviews with that book id';
    for(let i = 0; i < reviewsList.length; i++) {
      reviewsList[i].dateOfReview = reviewsList[i].dateOfReview.toLocaleDateString();
    }
    return reviewsList;
  },

  async getReview(bookId, reviewId) {
    if (!reviewId) throw 'You must provide an id to search for';
    // let { ObjectId } = require('mongodb');
    let parsedReviewId = ObjectId(reviewId);
    const reviewCollection = await reviews();
    const review = await reviewCollection.findOne({ _id: parsedReviewId, bookBeingReviewed: bookId });
    if (review == null) throw 'Review not found';
    review.dateOfReview = review.dateOfReview.toLocaleDateString();
    return review;
  },

  async create(title, reviewer, bookBeingReviewed, rating, dateOfReview, review) {
    const book = await bookData.getBookById(bookBeingReviewed);
    if (book === null) throw `No book with id ${bookBeingReviewed}`;

    if (!title || typeof title != 'string' || title.trim().length === 0)
      throw 'You must provide a title for your review';
    if (!reviewer || typeof reviewer != 'string' || reviewer.trim().length === 0)
      throw 'You must provide an reviewer for your review';

    dateOfReview = new Date(dateOfReview);
    if (dateOfReview == 'Invalid Date')
      throw 'You must provide a dateOfReview for your review';

    if (!review || typeof review != 'string' || review.trim().length === 0)
      throw 'You must provide a review for your review';

    if(!rating || isNaN(rating) || rating < 0 || rating > 5)
      throw 'You must provide a valid rating for your review';

    const reviewCollection = await reviews();
    const insertInfo = await reviewCollection
      .insertOne({
        title: title,
        reviewer: reviewer,
        bookBeingReviewed: bookBeingReviewed,
        rating: rating,
        dateOfReview: dateOfReview,
        review: review
      });
    if (insertInfo.insertedCount === 0) throw 'Could not add review';

    const newId = insertInfo.insertedId;
    const bookCollection = await books();
    // let { ObjectId } = require('mongodb');
    let parsedBookId = ObjectId(bookBeingReviewed);
    await bookCollection.updateOne( { _id: parsedBookId }, { $addToSet: { reviews: { $each: [newId.toString()] }}});

    return await this.getReview(bookBeingReviewed, `${newId}`);
  },
  async remove(bookId, reviewId) {
    if (!bookId) throw 'You must provide a book id to search for';
    if (typeof bookId != 'string' || bookId.trim().length === 0)
      throw 'You must provide a valid book id to search for';
    if (!reviewId) throw 'You must provide a review id to search for';
    if (typeof reviewId != 'string' || reviewId.trim().length === 0)
      throw 'You must provide a valid review id to search for';
    // let { ObjectId } = require('mongodb');
    let parsedReviewId = ObjectId(reviewId);

    const reviewCollection = await reviews();
    const bookCollection = await books();
    const review = await this.getReview(bookId, `${reviewId}`);
    const book = await bookData.getBookById(bookId);
    let parsedBookId = ObjectId(bookId);
    let modifiedBookInfo = await bookCollection.updateOne(
      { _id: parsedBookId },
      { $pull: { reviews: reviewId } }
    );
    if(modifiedBookInfo.modifiedCount === 0) throw 'Review is not deleted from book';
    const deletionInfo = await reviewCollection.deleteOne({ _id: parsedReviewId, bookBeingReviewed: bookId });

    if (deletionInfo.deletedCount === 0) {
      throw `Could not delete review with id of ${reviewId}`;
    }

    return review;
  }
};

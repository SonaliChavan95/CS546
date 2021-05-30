const mongoCollections = require('../config/mongoCollections');
const books = mongoCollections.books;
const reviews = mongoCollections.reviews;
const { ObjectId } = require('mongodb');

module.exports = {
  async getBookById(id) {
    if (!id) throw 'You must provide a book id to search for';
    if (typeof id != "string" || id.trim().length === 0) throw 'You must provide a valid book id to search for';
    // let { ObjectId } = require('mongodb');
    let parsedId = ObjectId(id);

    const bookCollection = await books();
    const book = await bookCollection.findOne({ _id: parsedId });
    if (book === null) throw 'No book with that id';
    book._id = id;
    book.datePublished = book.datePublished.toLocaleDateString();
    return book;
  },

  async getAllBooks() {
    const bookCollection = await books();

    const bookList = await bookCollection
      .find(
        {},
        { projection: { title: 1 }
      }).toArray();

    return bookList;
  },

  async create(title, author, genre, datePublished, summary) {
    if (!title || typeof title != 'string' || title.trim().length === 0)
      throw 'You must provide a title for your book';
    if (!author || typeof author != 'object' || Array.isArray(author))
      throw 'You must provide an author for your book';
    if(!author.authorFirstName || typeof author.authorFirstName != 'string' || author.authorFirstName.trim().length === 0)
      throw 'You must provide a authorFirstName for your book';
    if(!author.authorLastName || typeof author.authorLastName != 'string' || author.authorLastName.trim().length === 0)
      throw 'You must provide a authorLastName for your book';
    if (!genre || !Array.isArray(genre))
      throw 'You must provide an array of genre for your book';
    if (genre.length === 0)
      throw 'You must provide at least one genre for a book.';
    if (!genre.every(i => (typeof i === "string" && i.trim().length > 0)))
      throw 'You must provide an array of string in genre'

    datePublished = new Date(datePublished);
    if (datePublished == 'Invalid Date')
      throw 'You must provide a valid datePublished for your book';

    if (!summary || typeof summary != 'string' || summary.trim().length === 0)
      throw 'You must provide a summary for your book';

    const bookCollection = await books();

    let newBook = {
      title: title,
      author: author,
      genre: genre,
      datePublished: datePublished,
      summary: summary,
      reviews: []
    };

    const insertInfo = await bookCollection.insertOne(newBook);
    if (insertInfo.insertedCount === 0) throw 'Could not add book';

    const newId = insertInfo.insertedId;
    const book = await this.getBookById(`${newId}`);
    return book;
  },
  async remove(id) {
    if (!id) throw 'You must provide an id to search for';
    if (typeof id != "string" || id.trim().length === 0) throw 'You must provide a valid id to search for';
    // let { ObjectId } = require('mongodb');
    let parsedId = ObjectId(id);

    const bookCollection = await books();
    const book = await this.getBookById(`${id}`);
    const deletionInfo = await bookCollection.deleteOne({ _id: parsedId });

    const reviewCollection = await reviews();
    const reviewsList = await reviewCollection.deleteMany({ bookBeingReviewed: id });

    if (deletionInfo.deletedCount === 0) {
      throw `Could not delete book with id of ${id}`;
    }

    return book;
  },
  async update(id, newBookData, requestType = "put") {
    const{ title, author, genre, datePublished, summary } = newBookData;
    if (!id)
      throw 'You must provide an id to search for';
    if (typeof id != "string" || id.trim().length === 0)
      throw 'You must provide a valid id to search for';
    if (title)
      if (typeof title != 'string' || title.trim().length === 0)
        throw 'You must provide a title for your book';
    if (author) {
      if( typeof author != 'object' || Array.isArray(author))
        throw 'You must provide an author for your book';
      if(!author.authorFirstName || typeof author.authorFirstName != 'string' || author.authorFirstName.trim().length === 0)
        throw 'You must provide a authorFirstName for your book';
      if(!author.authorLastName || typeof author.authorLastName != 'string' || author.authorLastName.trim().length === 0)
        throw 'You must provide a authorLastName for your book';
    }
    if (genre) {
      if(!Array.isArray(genre))
        throw 'You must provide an array of genre for your book';
      if (!genre.every(i => (typeof i === "string" && i.trim().length > 0)))
        throw 'You must provide an array of string in genre'
    }

    let newDatePublished;
    if (datePublished) {
      newDatePublished = new Date(datePublished);
      if (newDatePublished == 'Invalid Date')
        throw 'You must provide a datePublished for your book';
    }

    if (summary)
      if (typeof summary != 'string' || summary.trim().length === 0)
        throw 'You must provide a summary for your book';

    // let { ObjectId } = require('mongodb');
    let parsedId = ObjectId(id);

    const bookCollection = await books();
    let updatedBook = {
      title: title,
      author: author,
      genre: genre,
      datePublished: newDatePublished,
      summary: summary
    };
    let updatedInfo;
    if(requestType == "patch") {
      Object.keys(updatedBook).forEach(key => updatedBook[key] === undefined ? delete updatedBook[key] : {});
      delete updatedBook.genre;
      let query;
      if (genre)
        query = { $set: updatedBook, $addToSet: { genre: { $each: genre }}};
      else
        query = { $set: updatedBook };

      if (Object.keys(updatedBook).length === 0)
        delete query.$set;
      updatedInfo = await bookCollection.updateOne( { _id: parsedId }, query );
    } else {
      updatedInfo = await bookCollection.updateOne(
        { _id: parsedId },
        { $set: updatedBook }
      );
    }
    if (updatedInfo.modifiedCount === 0) {
      throw 'could not update book successfully';
    }

    return await this.getBookById(id);
  }
};

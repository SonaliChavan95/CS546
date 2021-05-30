const express = require('express');
const router = express.Router();
const data = require('../data');
const bookData = data.books;

router.get('/:id', async (req, res) => {
  try {
    let book = await bookData.getBookById(req.params.id);
    res.json(book);
  } catch (e) {
    res.status(404).json({ error: 'Book not found' });
  }
});

router.get('/', async (req, res) => {
  try {
    let bookList = await bookData.getAllBooks();
    res.json(bookList);
  } catch (e) {
    res.status(500).json({error: e});
  }
});

router.post('/', async (req, res) => {
  let bookInfo = req.body;

  if (!bookInfo) {
    res.status(400).json({ error: 'You must provide data to create a book' });
    return;
  }

  if (!bookInfo.title) {
    res.status(400).json({ error: 'You must provide a title' });
    return;
  }

  if (!bookInfo.author) {
    res.status(400).json({ error: 'You must provide an author' });
    return;
  }

  if (!bookInfo.genre) {
    res.status(400).json({ error: 'You must provide a genre' });
    return;
  }

  if (!bookInfo.datePublished) {
    res.status(400).json({ error: 'You must provide a datePublished' });
    return;
  }

  if (!bookInfo.summary) {
    res.status(400).json({ error: 'You must provide a summary' });
    return;
  }

  try {
    const newBook = await bookData.create(
      bookInfo.title,
      bookInfo.author,
      bookInfo.genre,
      bookInfo.datePublished,
      bookInfo.summary
    );
    res.json(newBook);
  } catch (e) {
    res.status(500).json({error: e});
  }
});

router.put('/:id', async (req, res) => {
  let bookInfo = req.body;

  if (!bookInfo) {
    res.status(400).json({ error: 'You must provide data to create a book' });
    return;
  }

  if (!bookInfo.title) {
    res.status(400).json({ error: 'You must provide a title' });
    return;
  }

  if (!bookInfo.author) {
    res.status(400).json({ error: 'You must provide an author' });
    return;
  }

  if (!bookInfo.genre && bookInfo.genre.length < 1) {
    res.status(400).json({ error: 'You must provide a genre' });
    return;
  }

  if (!bookInfo.datePublished) {
    res.status(400).json({ error: 'You must provide an datePublished' });
    return;
  }

  if (!bookInfo.summary) {
    res.status(400).json({ error: 'You must provide an summary' });
    return;
  }

  try {
    await bookData.getBookById(req.params.id);
  } catch (e) {
    res.status(404).json({ error: e });
    return;
  }
  try {
    const updatedBook = await bookData.update(req.params.id, bookInfo, "put");
    res.json(updatedBook);
  } catch (e) {
    res.status(500).json({error: e});
  }
});

router.patch('/:id', async (req, res) => {
  const requestBody = req.body;
  let updatedObject = {};
  try {
    const oldBook = await bookData.getBookById(req.params.id);
    if (requestBody.title && requestBody.title !== oldBook.title)
      updatedObject.title = requestBody.title;
    if (requestBody.author && requestBody.author !== oldBook.author)
      updatedObject.author = requestBody.author;
    if (requestBody.genre && !requestBody.genre.every((v) => oldBook.genre.indexOf(v) >= 0))
      updatedObject.genre = requestBody.genre;
    if (requestBody.datePublished) {
      let newDate = new Date(requestBody.datePublished),
      oldDate = new Date(oldBook.datePublished);
      if(newDate.getTime() !== oldDate.getTime())
        updatedObject.datePublished = requestBody.datePublished;
    }
    if (requestBody.summary && requestBody.summary !== oldBook.summary)
      updatedObject.summary = requestBody.summary;
  } catch (e) {
    res.status(404).json({ error: e });
    return;
  }
  if (Object.keys(updatedObject).length > 0) {
    try {
      const updatedBook = await bookData.update(
        req.params.id,
        updatedObject,
        "patch"
      );
      res.json(updatedBook);
    } catch (e) {
      console.log(e)
      res.status(500).json({ error: e });
    }
  } else {
    res
      .status(400)
      .json({
        error:
          'No fields have been changed from their inital values, so no update has occurred'
      });
  }
});

router.delete('/:id', async (req, res) => {
  if (!req.params.id) throw 'You must specify an ID to delete';
  let book;
  try {
    book = await bookData.getBookById(req.params.id);
  } catch (e) {
    res.status(404).json({ error: e });
    return;
  }

  try {
    await bookData.remove(req.params.id);
    res.status(200).json({bookId: book._id.toString(), deleted: true});
  } catch (e) {
    res.status(500).json({error: e});
  }
});

module.exports = router;

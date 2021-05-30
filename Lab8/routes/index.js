const showRoutes = require('./shows');
const data = require('../data');
const showData = data.shows;

const constructorMethod = (app) => {
  app.get('/', (req, res) => {
    console.log("home page");
    res.render('search', {
      title: 'Show Finder'
    });
  });
  
  app.use('/shows', showRoutes);

  app.post('/search', async (req, res) => {
    let searchData = req.body;
    let errors = [];

    if (!searchData.searchTerm || searchData.searchTerm.trim().length < 1) {
      errors.push('No search term provided');
    }

    if (errors.length > 0) {
      res.status(400).render('error', { 
        message: "Enter search term",
        title: "400 Bad Request"
      });
    }
  
    try {
      const searchResult = await showData.searchShows(
        searchData.searchTerm
      );
      
      res.render('shows/index', { 
        shows: searchResult, 
        title: 'Shows Found',
        query: searchData.searchTerm
      });
    } catch (e) {
      res.status(500).render('error', { 
        message: e,
        title: "500 Internal Server Error"
      });
    }
  });

  app.use('*', (req, res) => {
    console.log("wrong path");
    res.status(404).render('error', { 
      message: 'Not found',
      title: "404 Not found"
    });
  });
};

module.exports = constructorMethod;
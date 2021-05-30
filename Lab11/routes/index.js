// const showRoutes = require('./shows');
// const data = require('../data');
// const showData = data.shows;

const constructorMethod = (app) => {
  app.get('/', (req, res) => {
    res.render('home', {
      title: 'Home'
    });
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
const constructorMethod = (app) => {
  app.get('/', (req, res) => {
    console.log("home page");
    res.render('home', {
      title: 'The Whole Fibonacci & Prime Number Checker'
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

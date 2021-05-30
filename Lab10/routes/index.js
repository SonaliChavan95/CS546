const userRoutes = require('./users');
const privateRoutes = require('./private');

const constructorMethod = (app) => {
  app.use('/', userRoutes);
  app.use('/private', privateRoutes);

  app.use('*', (req, res) => {
    res.status(404).render('error', {
      title: 'Page Not Found',
      message: "The page you are looking for does not exist."
    });
  });
};

module.exports = constructorMethod;
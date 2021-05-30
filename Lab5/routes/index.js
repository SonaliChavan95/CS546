const showRoutes = require('./shows');

const constructorMethod = (app) => {
  app.use('/shows', showRoutes);

  app.use('/aboutme', (req, res) => {
    res.status(200).json({
      "name": "Sonali Chavan",
      "cwid": "10459154",
      "biography": "I am from India. I was a Ruby on Rails developer before resuming my studies. I love reading. I enjoy stroll on a beach.",
      "favoriteShows": ["Masterchef", "Rang Maja Vegala(Indian TV Show)", "The Big Bang Theory"]
    });
  });

  app.use('*', (req, res) => {
    res.status(404).json({ error: 'Not found' });
  });
};

module.exports = constructorMethod;
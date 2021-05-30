const getData = require('./getData');

let exportedMethods = {
  async searchShows(searchTerm) {
    const searchCollection = await getData.searchApi(searchTerm);
    const shows = await searchCollection;
    return shows.slice(0, 20);
  },
  
  async getShowById(id) {
    if(Math.sign(id) != 1) throw "Enter a positive id"
    const show = await getData.getShowApi(id);

    if (!show) throw 'Show not found';

    console.log(show);
    return {
      name: show.name,
      img: show.image && show.image.medium,
      language: show.language,
      genres: show.genres,
      rating: show.rating && show.rating.average,
      network: show.network && show.network.name,
      summary: show.summary && show.summary.replace(/(<([^>]+)>)/gi, "")
    };
  }
};

module.exports = exportedMethods;
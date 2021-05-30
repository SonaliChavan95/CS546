const getData = require('./getdata');

let exportedMethods = {
  async getAllShows() {
    const showCollection = await getData.getShowListApi();
    return await showCollection;
  },
  async getShowById(id) {
    if(Math.sign(id) != 1) throw "Enter a positive id"
    const show = await getData.getShowApi(id);

    if (!show) throw 'Show not found';
    return show;
  }
};

module.exports = exportedMethods;
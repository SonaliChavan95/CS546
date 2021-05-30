const axios = require('axios');

async function getShowListApi() {
  //try removing the await keyword and run the application
  let { data } = await axios.get('http://api.tvmaze.com/shows');

  return data;
}

async function getShowApi(id) {
  //try removing the await keyword and run the application
  let { data } = await axios.get(`http://api.tvmaze.com/shows/${id}`);

  return data;
}

module.exports = { getShowListApi, getShowApi };
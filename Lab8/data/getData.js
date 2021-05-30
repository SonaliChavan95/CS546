const axios = require('axios');

async function searchApi(query) {
  let { data } = await axios.get(`http://api.tvmaze.com/search/shows?q=${query}`);
  return data;
}

async function getShowApi(id) {
  let { data } = await axios.get(`http://api.tvmaze.com/shows/${id}`);
  return data;
}

module.exports = { searchApi, getShowApi };
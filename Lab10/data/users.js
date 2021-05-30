const users = require('../users');

let exportedMethods = {
  getUserByName(username) {
    if (!username) throw 'You must provide a username';
    if (typeof username != 'string' || username.trim().length === 0)
      throw 'You must provide a valid username';

    const user = users.filter(user => user.username === username);

    if (user.length === 0) throw 'User not found';
    return user[0];
  }
};

module.exports = exportedMethods;
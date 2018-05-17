const database = require('../index');

const GET_USERS_QUERY = `SELECT username, email FROM users`;

const getUsers = () => {
  return database.any(GET_USERS_QUERY)
    .catch((error) => {console.log("In getUsers.js: "+error.stack)});
}

module.exports = getUsers;
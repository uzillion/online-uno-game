const database = require('../index');

const INSERT_USER_QUERY = `INSERT INTO users
  (username,email,password)
  VALUES($1,$2,$3)
  RETURNING "id", "username"`;

const addUser = userObject => {
  const VALUES = [ userObject.username, userObject.email, userObject.password];

  return database
    .one( INSERT_USER_QUERY, VALUES )
    .catch( error => console.log( "ERROR: ", error ) );
};

module.exports = addUser;

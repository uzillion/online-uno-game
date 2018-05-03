const database = require('../index');

const INSERT_USER_QUERY = `INSERT INTO users
  (username,email,password)
  VALUES($1,$2,$3)
  RETURNING "id", "username"`;

const addUser = userObject => {
  const VALUES = [ userObject.username, userObject.email, userObject.password];

  return database
    .one( INSERT_USER_QUERY, VALUES )
    .then((user) => {
      database.query(`INSERT INTO score (user_id) VALUES(${user.id})`);
    })
    .catch( error => console.log( "ERROR: ", error ) );
};

module.exports = addUser;

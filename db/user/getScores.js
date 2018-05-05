const database = require('../index');

const GET_SCORES_QUERY = `SELECT username, score FROM score 
  INNER JOIN users 
  ON users.id = score.user_id
  ORDER BY score DESC;`;

const getScores = () => {
  return database
    .any(GET_SCORES_QUERY)
    .catch( error => {console.log(error.stack)});
}

module.exports = getScores;

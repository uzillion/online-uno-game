const database = require('../index');

const GET_SCORES_QUERY = `SELECT username, score FROM score 
  INNER JOIN users 
  ON users.id = score.user_id
  ORDER BY score DESC;`;

const getScores = (callback) => {
  database
    .any(GET_SCORES_QUERY)
    .then(data => {return callback(data, null)})
    .catch( error => {return callback(null, error); console.log(error)});
}

module.exports = getScores;

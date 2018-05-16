const database = require('../index');

const UPDATE_SCORE_QUERY = `UPDATE score
  SET score = $1
  WHERE user_id = $2`;

const GET_SCORE_QUERY = `SELECT score FROM score
  WHERE user_id = $1`;

const updateScore = (user_id, score) => {
  return database
    .one(GET_SCORE_QUERY, user_id)
    .then((dbScore) => {
      console.log("DbScore: "+JSON.stringify(dbScore));
      let newScore = dbScore.score + score;
      console.log("New Score: "+newScore);
      return database.query(UPDATE_SCORE_QUERY, [newScore, user_id]);
    }).catch(error => {console.log("In updateScore.js: "+error.stack)});
};

module.exports = updateScore;
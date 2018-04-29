const database = require('../index');

const GET_ROOMS_QUERY = `SELECT * FROM gameroom`;

const getAllRooms = (callback) => {
  database
    .manyOrNone(GET_ROOMS_QUERY)
    .then((data) => {callback(data)})
    .catch( error => {return callback(error); console.log( "Could not get rooms: ", error)});
}

module.exports = getAllRooms;

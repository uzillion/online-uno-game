'use strict';
module.exports = (sequelize, DataTypes) => {
  var gameroom = sequelize.define('gameroom', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    n_players: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    }
  });
  return gameroom;
};

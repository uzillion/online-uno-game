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
    },
    current_turn: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    current_card: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: null
    },
    deck: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: null
    }
  });
  return gameroom;
};

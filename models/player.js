'use strict';
module.exports = (sequelize, DataTypes) => {
  var player = sequelize.define('player', {
    has_won: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    turn_number: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    hand: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {cards: []}
    }
  },{
    classMethods: {
      associate: function( models ) {
        player.belongsTo(models.users);
        player.belongsTo(models.gameroom)
      }
    }
  });
  return player;
};

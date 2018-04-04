'use strict';
module.exports = (sequelize, DataTypes) => {
  var player = sequelize.define('player', {
    has_won: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
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

'use strict';
module.exports = (sequelize, DataTypes) => {
  var hand = sequelize.define('hand', {
    deck: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    }
  }, {
    classMethods: {
      associate: function( models ) {
        hand.belongsTo(models.player);
      }
    }
  });
  return hand;
};

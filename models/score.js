'use strict';
module.exports = (sequelize, DataTypes) => {
  var score = sequelize.define('score', {
    score: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    classMethods: {
      associate: function( models ) {
        score.belongsTo(models.users);
      }
    }
  });
  return score;
};

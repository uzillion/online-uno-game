'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      'gameroom',
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        n_players: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0
        },
        current_turn: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0
        },
        current_color: {
          type: Sequeliz.STRING,
          allowNull: true,
          defaultValue: null
        }
      }
    );
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('user');
  }
};

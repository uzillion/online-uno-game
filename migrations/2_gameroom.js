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
        current_card: {
          type: Sequelize.JSON,
          allowNull: true,
          defaultValue: null
        },
        deck: {
          type: Sequelize.JSON,
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

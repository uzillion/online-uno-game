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
        locked: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: 'f'
        }
      }
    );
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('user');
  }
};

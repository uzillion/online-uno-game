'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      'score',
      {
        user_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model:'users',
            key:'id'
          }
        },
        score: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0
        }
      }
    );
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('users');
  }
};

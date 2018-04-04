'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      'hand',
      {
        user_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model:'users',
            key:'id'
          }
        },
        room_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model:'gameroom',
            key:'id'
          }
        },
        deck: {
          type: Sequelize.INTEGER,
          defaultValue: 0
        }
      }
    )
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('user');
  }
};

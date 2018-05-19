'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      'player',
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
        hand: {
          type: Sequelize.JSONB,
          allowNull: true,
          defaultValue: {cards: []}
        },
        turn_number: {
          type: Sequelize.INTEGER,
          allowNull: false
        }
      }
    )
    .then(() => {
      return queryInterface.sequelize.query('ALTER TABLE "player" ADD CONSTRAINT "id" PRIMARY KEY ("user_id", "room_id")');
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('user');
  }
};

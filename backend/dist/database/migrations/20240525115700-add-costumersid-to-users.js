'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Users', 'customer_id', {
      type: Sequelize.STRING,
      allowNull: true // Defina como false se o telefone for obrigatório
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Users', 'customer_id');
  }
};

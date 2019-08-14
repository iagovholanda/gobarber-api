module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('users', {
      id: {
        type: Sequelize.INTEGER,
        /* Não permite nulo */
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        /* Campo unico, sem repeticao */
        unique: true,
      },
      password_hash: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      provider: {
        type: Sequelize.BOOLEAN,
        /* Por padrão esse valor vai ser falso, ou seja vai ser sempre um cliente.
        Quando for definido como provider ou prestador de serviço esse campo passa
        a ser verdadeiro. */
        defaultValue: false,
        allowNull: false,
      },
      /* Campos criados de acordo com a criação e atualização de um registro */
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: queryInterface => {
    return queryInterface.dropTable('users');
  },
};

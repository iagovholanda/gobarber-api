module.exports = {
  up: (queryInterface, Sequelize) => {
    /* Adicionando uma nova coluna, passando como primeiro parametro a tabela que
    desejamos adicionar a coluna, e como segundo parametro a coluna que desejamos
    inserir na tabela. */
    return queryInterface.addColumn('users', 'avatar_id', {
      /* Caracteristica da nova coluna e suas referencias */
      type: Sequelize.INTEGER,
      references: { model: 'files', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      allowNull: true,
    });
  },

  down: queryInterface => {
    return queryInterface.removeColumn('users', 'avatar_id');
  },
};

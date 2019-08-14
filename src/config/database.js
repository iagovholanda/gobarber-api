require('dotenv/config');

module.exports = {
  dialect: 'postgres',
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  define: {
    /* Colunas created e updated at */
    timestamps: true,
    /* Padrão de nomeclatura de tabelas e colunas */
    underscored: true,
    /* Padrão de nomeclatura atribuido aos relacionamentos */
    underscoredAll: true,
  },
};

/* Cara responsavel por fazer a conexao com o banco */
import Sequelize from 'sequelize';
/* ORM - MongoDB */
import mongoose from 'mongoose';

/* Importar todos os arrays da aplicação */
import User from '../app/models/User';
import File from '../app/models/File';
import Appointments from '../app/models/Appointments';

/* Importando as configurações passadas no arquivo database.js */
import databaseConfig from '../config/database';

/* Importar um array de todos os models da aplicação */
const models = [User, File, Appointments];

class Database {
  constructor() {
    /* Chamando o proprio metodo init, dentro do metodo constructor. Lembrando
    que o metodo constructor vai ser executado, sempre que classe for estanciada. */
    this.init();
    this.mongo();
  }

  /* Vai realizar a conexao com o banco de dados e carregar os nossos models */
  init() {
    /* Desta forma ja temos a conexão com a base de dados. Essa variavel
    this.connection é a mesma que esta sendo esperada dentro dos models no seus
    metodos init */
    this.connection = new Sequelize(databaseConfig);

    /* Percorre o array de models para chamar conexão com sequelize. O model, passado
    dentro do map, trata-se de todos os models presente dentro da aplicação de tal forma
    que todas obtenha essa conexão. */
    models
      .map(model => model.init(this.connection))
      /* Esse metodo associate, é utilizado para todos os relacionamentos
      criado dentro dos models */
      .map(model => model.associate && model.associate(this.connection.models));
  }

  /* Configuração do MongoDB */
  mongo() {
    this.mongoConnection = mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useFindAndModify: true,
    });
  }
}

export default new Database();

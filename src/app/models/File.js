import Sequelize, { Model } from 'sequelize';

class File extends Model {
  /* Metodo chamado automaticamente pelo sequelize. Passando a conexão do sequelize
  passado dentro do index.js configurado. */
  static init(sequelize) {
    /* Chamando o metodo init da classe model, que é a classe pai */
    super.init(
      {
        /* Objeto contendo todas as colunas que vão ser utilizadas para
        criação, atualização, dentre outras funções. */
        name: Sequelize.STRING,
        path: Sequelize.STRING,
        /* Criar uma campo virtual para retornar a url do arquivo */
        url: {
          type: Sequelize.VIRTUAL,
          /* Como eu quero formatar esse valor */
          get() {
            return `${process.env.APP_URL}/files/${this.path}`;
          },
        },
      },
      {
        sequelize,
      }
    );

    /* Sempre vai executar e retornar o model, que acabou de ser inicializado aqui dentro */
    return this;
  }
}

/* Por fim ocorre a exportação do usuário */
export default File;

import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';

class User extends Model {
  /* Metodo chamado automaticamente pelo sequelize. Passando a conexão do sequelize
  passado dentro do index.js configurado. */
  static init(sequelize) {
    /* Chamando o metodo init da classe model, que é a classe pai */
    super.init(
      {
        /* Objeto contendo todas as colunas que vão ser utilizadas para
        criação  atualização, dentre outras funções. */
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.VIRTUAL,
        password_hash: Sequelize.STRING,
        provider: Sequelize.BOOLEAN,
      },
      {
        sequelize,
      }
    );
    /* Usando funções de hooks do sequelize, que são trechos de codigo que são
      executados de forma automatica, baseado em ações que acontecem no nosso model.
      No exemplo a seguir, antes do usuário ser salvo ou atualizado, esse hook vai ser
      executado antes.
      Nesse hook o hash da senha so vai ser gerado quando um novo password for passado */
    this.addHook('beforeSave', async user => {
      if (user.password) {
        /* Usando o hash pra criptografia, além de passar o campo que deseja realizar
        a criptografia com o numero de rounds da criptografia, que se trata da força
        da criptografia. */
        user.password_hash = await bcrypt.hash(user.password, 8);
      }
    });

    /* Sempre vai executar e retornar o model, que acabou de ser inicializado aqui dentro */
    return this;
  }

  static associate(models) {
    /* Evitando colocar mais um campo dentro do init(), realizamos a associação
    no qual um usuario, pertece a um file. Como segundo parametro, passo o nome
    da coluna que armazena essa referencia. */
    /* Codenome para o campo avatar_id -> as: 'avatar' */
    this.belongsTo(models.File, { foreignKey: 'avatar_id', as: 'avatar' });
  }

  /* Metodo criado para verificação da senha do usuário */
  checkPassword(password) {
    /* Comparando as duas senhas do usuário, onde password retorna a senha passada pelo
    usuário e password_hash retorna a senha salva no usuário. O metodo this, permite acesso
    a todas as informações do usuario. */
    return bcrypt.compare(password, this.password_hash);
  }
}

/* Por fim ocorre a exportação do usuário */
export default User;

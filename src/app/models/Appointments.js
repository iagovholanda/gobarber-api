import Sequelize, { Model } from 'sequelize';
import { isBefore, subHours } from 'date-fns';

class Appointments extends Model {
  /* Metodo chamado automaticamente pelo sequelize. Passando a conexão do sequelize
  passado dentro do index.js configurado. */
  static init(sequelize) {
    /* Chamando o metodo init da classe model, que é a classe pai */
    super.init(
      {
        date: Sequelize.DATE,
        canceled_at: Sequelize.DATE,
        /* Informaçõs de agendamentos que ja aconteceram */
        past: {
          type: Sequelize.VIRTUAL,
          /* Verificar se a data do lançamento é anterior
          a data atual */
          get() {
            return isBefore(this.date, new Date());
          },
        },
        /* Retornar se o agendamento é cancelavel ou não */
        cancelable: {
          type: Sequelize.VIRTUAL,
          /* Retirando duas horas da data do agendamento e verificando se
          é possivel ou não cancelar esse agendamento. */
          get() {
            return isBefore(new Date(), subHours(this.date, 2));
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

  /* Relacionamentos */
  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    this.belongsTo(models.User, { foreignKey: 'provider_id', as: 'provider' });
  }
}

export default Appointments;

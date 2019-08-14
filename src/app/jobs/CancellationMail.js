import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class CancellationMail {
  /* Get é como se estivesse declarando uma varaivel key dentro da aplicação.
  Quando importada a classe, o mesmo pode ter acesso a essa propriedade. */
  get key() {
    return 'CancellationMail';
  }

  /* Tarefa que vai executar quando o processo for executado. O handle vai retornar informações
  e dentro destas informações vai retornar um data. Esse data é onde vai todas as informações
  necessarias para o envio de email. */
  async handle({ data }) {
    const { appointment } = data;

    await Mail.sendMail({
      /* Para quem eu quero enviar o email */
      to: `${appointment.provider.name} <${appointment.provider.email}>`,
      subject: 'Agendamento Cancelado',
      template: 'cancellation',
      context: {
        provider: appointment.provider.name,
        user: appointment.user.name,
        date: format(
          parseISO(appointment.date),
          "'dia' dd 'de' MMMM', às' H:mm 'h'",
          {
            locale: pt,
          }
        ),
      },
    });
  }
}

export default new CancellationMail();

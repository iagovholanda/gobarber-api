import * as Yup from 'yup';
/* Importando apenas alguns metodos do data-fns */
import { startOfHour, parseISO, isBefore, format, subHours } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Appointment from '../models/Appointments';
import User from '../models/User';
import File from '../models/File';

/* Importando schema de Notificações */
import Notification from '../schemas/Notification';

import CancellationMail from '../jobs/CancellationMail';
/* Importa a fila do lugar do email */
import Queue from '../../lib/Queue';

class AppointmentController {
  /* Listagem de agendamentos e informações */
  async index(req, res) {
    /* Paginação de agendamentos */
    /* Paginas com a quantidade x de agendamentos. Caso a pagina não seja
    definida, por padrão ela vai definir como a pagina 1. */
    const { page = 1 } = req.query;
    /* req.query -> Requisições passsadas e presentes na URL */

    const appointments = await Appointment.findAll({
      where: {
        /* Listando todos os agendamentos do usuário logado / seja o do mesmo id do que esta logado
        e que não foram cancelados */
        user_id: req.userId,
        canceled_at: null,
      },
      /* Ordenação dos agendamentos por data */
      order: ['date'],
      /* Limite de agendamentos por pagina */
      limit: 20,
      /* Numero de registros que devemos pular por pagina. Exemplo, se ela tiver na pagina 2
      ela vai pular 20 registros, e retornar mais 20 registros */
      offset: (page - 1) * 20,
      attributes: ['id', 'date', 'past', 'cancelable'],
      /* Retornando mais detalhes das informações do provider, no qual o agendamento
      possui relacionamento, assim como o usuário que realizou o agendamento. */
      include: [
        {
          model: User,
          as: 'provider',
          /* Retornando apenas informações necessarias do provider */
          attributes: ['id', 'name'],
          /* Retornando informações dos arquivos de provider */
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['id', 'path', 'url'],
            },
          ],
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name'],
        },
      ],
    });
    return res.json(appointments);
  }

  /* Cadastro de agendamentos  */
  async store(req, res) {
    /* Schema de validação */
    const schema = Yup.object().shape({
      provider_id: Yup.number().required(),
      date: Yup.date().required(),
    });

    /* Verificação se a validação é ou não valida */
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { provider_id, date } = req.body;

    /* Checando se o provider_id passado é realmente um provider */
    const isProvider = await User.findOne({
      /* Verificando se o id do usuário passado é um provider_id e retornado
      como um provider */
      where: { id: provider_id, provider: true },
    });

    if (!isProvider) {
      return res
        .status(401)
        .json({ error: 'You can only create appointments with providers' });
    }

    /* Verificando se o usuário logado é um provider, de modo a impedir que o mesmo
    possa realizar um agendamento. Pois um provider, não pode realizar agendamento
    sendo provider. */
    if (req.userId === provider_id) {
      return res
        .status(401)
        .json({ error: "Providers can't create appointments with providers" });
    }

    /* O parseISO vai transformar string passada no date,em um objeto date do javascript
    de modo que esse objeto pode ser utilizado dentro do startOfHour, pegando apenas a data
    inicial, guardando apenas datas fechadas, ignorando minutos e segundos. */
    const hourStart = startOfHour(parseISO(date));

    /* Verifica se a hourStart passada esta antes da nova data (new Date). Se isso passar
    ou for menor no caso, então quer dizer que a data que o mesmo esta tentando utilizar
    ja passou. */
    if (isBefore(hourStart, new Date())) {
      return res.status(400).json({ error: 'Past dates are not permitted' });
    }

    /* Verifica se o provider ja não possui um agendamento marcado para o mesmo horario.
    Buscar um agendamento, onde o provider_id seja o provider que o usuário esteja tentando
    passar o agendamento. O canceled_at seja null, porque caso seja cancelado não vai ter
    problema. O date, passa a hora no qual o usuário deseja realizar o procedimento. */
    const checkAvailability = await Appointment.findOne({
      where: {
        provider_id,
        canceled_at: null,
        date: hourStart,
      },
    });

    /* Se o checkAvailability for true, então quer dizer que o horario não esta vago. */
    if (checkAvailability) {
      return res
        .status(400)
        .json({ error: 'Appointment date is not available' });
    }

    const appointment = await Appointment.create({
      user_id: req.userId,
      provider_id,
      date,
    });

    const user = await User.findByPk(req.userId);
    const formatteDate = format(
      hourStart,
      "'dia' dd 'de' MMMM', às' H:mm 'h'",
      { locale: pt }
    );

    /* Notificar o prestador de serviço por seus agendamentos */
    await Notification.create({
      content: `Novo agendamento de ${user.name} para ${formatteDate}`,
      user: provider_id,
    });

    return res.json(appointment);
  }

  async delete(req, res) {
    /* Buscando os dados do agendamento pela requisição. */
    const appointment = await Appointment.findByPk(req.params.id, {
      /* Incluindo informações do prestador de serviço */
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['name', 'email'],
        },
        {
          model: User,
          as: 'user',
          attributes: ['name'],
        },
      ],
    });

    /* Verificar se o id do usuário do agendamento é diferente do id
    do usuário que esta logado. Se for, um error vai ser retornado.
    Para cancelar o agendamento, o usuário logado, tem que ser o mesmo
    do agendamento. */
    if (appointment.user_id !== req.userId) {
      return res.status(401).json({
        error: "You don't have permission to cancel this appointment",
      });
    }

    /* subHours -> Definido dentro do date-fns. Reduz o numero de horas de um
    horario ou uma data especifica. Nesse caso, ele passa o campo que ele quer
    pegar, menos a quantidade de horas que ele quer diminuir. */
    const dateWithSub = subHours(appointment.date, 2);

    /* Apos diminuir as horas da data especifica, precisamos verificar
    se a horario continua sendo menor que a hora atual. */
    if (isBefore(dateWithSub, new Date())) {
      return res.status(401).json({
        error: 'You can only cancela appoitments 2 hours in advance. ',
      });
    }

    /* Data atual vai ser atualizada dentro do campo canceled_at.
    Caso o horario esta duas horas antes do horario do agendamento
    a campo canceled_at recebe a data atual. */
    appointment.canceled_at = new Date();

    /* Salva as informações do appointment */
    await appointment.save();

    /* Novo processo e requisição para controle de email - job */
    await Queue.add(CancellationMail.key, {
      appointment,
    });

    return res.json(appointment);
  }
}

export default new AppointmentController();

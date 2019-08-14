import {
  startOfDay,
  endOfDay,
  setHours,
  setMinutes,
  setSeconds,
  format,
  isAfter,
} from 'date-fns';
import { Op } from 'sequelize';
import Appointments from '../models/Appointments';

class AvailableController {
  async index(req, res) {
    /* Passando a data como parametro query, esta data trata-se
    da data do dia atual. */
    const { date } = req.query;

    /* Verificando se existe ou não esta data */
    if (!date) {
      return res.status(400).json({ error: 'Invalid date' });
    }

    /* Transformar essa data em um numero inteiro */
    const searchDate = Number(date);

    /* startOfDay, endOfDay -> Listar todos os agendamentos do inicio
    do dia ate o fim do dia. */
    const appointment = await Appointments.findAll({
      where: {
        /* Pegando o id do provider_id */
        provider_id: req.params.providerId,
        /* Pegar os agendamentos que não estão cancelados */
        canceled_at: null,
        date: {
          [Op.between]: [startOfDay(searchDate), endOfDay(searchDate)],
        },
      },
    });

    /* Todos os horarios disponiveis que um provider possui */
    const schedule = [
      '08:00',
      '09:00',
      '10:00',
      '11:00',
      '12:00',
      '13:00',
      '14:00',
      '15:00',
      '16:00',
      '17:00',
      '18:00',
      '19:00',
    ];

    /* Objeto que vai retornar as datas disponiveis para o usuário */
    const available = schedule.map(time => {
      /* Separação de informação através do split, de forma que o que vinher
      antes dos dois pontos é hora e depois dos dois pontos é minutos. */
      const [hour, minute] = time.split(':');

      /* Seta os minutos como segundos como zero, recebe os minutos de acordo com o
      que foi passado no array de horarios (schedule), depois recebe a hora retornada
      no searchDate, recebendo as hour. */
      const value = setSeconds(
        setMinutes(setHours(searchDate, hour), minute),
        0
      );

      return {
        time,
        value: format(value, "yyyy-MM-dd'T'HH:mm:ssxxx"),
        /* Verificando se o horario esta depois da data/horario no momento atual (agora) */
        available:
          isAfter(value, new Date()) &&
          /* Verifico se o horario passado não esta contido dentro do appointments (agendamentos).
        Caso esteja, então o horario não esta disponivel para agendamento. */
          !appointment.find(a => format(a.date, 'HH:mm') === time),
      };
    });

    return res.json(available);
  }
}

export default new AvailableController();

import { startOfDay, endOfDay, parseISO } from 'date-fns';
/* Operador no sequelize */
import { Op } from 'sequelize';

import User from '../models/User';
import Appointment from '../models/Appointments';

class ScheduleController {
  async index(req, res) {
    const checkUserProvider = await User.findOne({
      where: { id: req.userId, provider: true },
    });

    if (!checkUserProvider) {
      return res.status(401).json({ error: 'User is not a provider' });
    }

    const { date } = req.query;
    const parsedDate = parseISO(date);

    const Appointments = await Appointment.findAll({
      where: {
        /* Retornar todas os agendamentos que o prestador passado é igual
        ao usuário logado na aplicação */
        provider_id: req.userId,
        canceled_at: null,
        date: {
          /*
          Comparação beetwen. Pega o valor desse Op.between que vai ser retornado em um array,
          retornando como chave do objeto que a gente tem, retornando com um valor de comparação.
          Passando dois valores que vão definir quais agendamentos estão entre esse periodo do dia em especifico.

          startOfDay -> Começo do dia
          endOfDay -> Final do dia
          */

          [Op.between]: [startOfDay(parsedDate), endOfDay(parsedDate)],
        },
      },
      /* Ordenando por data */
      order: ['date'],
    });

    return res.json(Appointments);
  }
}

export default new ScheduleController();

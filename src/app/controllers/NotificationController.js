import User from '../models/User';
import Notification from '../schemas/Notification';

class NotificationController {
  async index(req, res) {
    const checkIsProvider = await User.findOne({
      /* Verificando se o id do usuário passado é um provider_id e retornado
      como um provider. O req.userId verifica se o usuário esta logado ou não. */
      where: { id: req.userId, provider: true },
    });

    /* Se ele não for um provider, então um erro é retornado. */
    if (!checkIsProvider) {
      return res
        .status(401)
        .json({ error: 'Only provider can load notifications' });
    }

    /* Diferente do postgres os metodos dos mongodb são diferentes
    dos metodos utilizados nos banco de dados como postgres etc. */
    const notification = await Notification.find({
      /* Retornar as notificações do usuário logado */
      user: req.userId,
    })
      /* Ordenando por data de criação e limitando o numero de notificações. */
      .sort({ createdAt: 'desc' })
      .limit(20);

    /* Retornando essas notificações através do res.json. */

    return res.json(notification);
  }

  async update(req, res) {
    /* Buscando notificação pelo id passado. O findByIdAndUpdate do mongoose
    permite ao mesmo tempo que a gente busque e atualize, determinado registro. */
    const notification = await Notification.findByIdAndUpdate(
      /* O que estamos buscando */
      req.params.id,
      /* Atualizando o read */
      { read: true },
      /* Depois de ele atualizar, ele vai retornar a nova notificação atualizada
      para a gente conseguir listar ela para o usuário. */
      { new: true }
    );

    return res.json(notification);
  }
}

export default new NotificationController();

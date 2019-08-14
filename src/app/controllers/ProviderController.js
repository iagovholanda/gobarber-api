import User from '../models/User';
import File from '../models/File';

class ProviderController {
  /* Listagem de todos os Providers */
  async index(req, res) {
    /* Retornando apenas os providers */
    const providers = await User.findAll({
      where: { provider: true },
      /* Retornando apenas algumas informações dos providers */
      attributes: ['id', 'name', 'email', 'avatar_id'],
      /* Retornar informações dos arquivos dos usuários, chamando o model de file
      no qual possui relacionamento, dando um codenome ao avatar do usuário, definido
      no associate */
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['name', 'path', 'url'],
        },
      ],
    });

    return res.json(providers);
  }
}

export default new ProviderController();

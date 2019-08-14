import jwt from 'jsonwebtoken';
import * as Yup from 'yup';
/* Importando o usuário que é o mesmo que vai ser autenticado */
import User from '../models/User';
/* Importando arquivos de configuração JWT */
import authConfig from '../../config/auth';

class SessionController {
  /* Cadastro de uma nova seção */
  async store(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string().required(),
    });

    /* Verificando se o req.body, esta passando e validano conforme o schema passado */
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { email, password } = req.body;

    /* Mesma verificação feita no UserController, verificando se existe um
    usuário com o email passado no corpo da requisição. */
    const user = await User.findOne({ where: { email } });

    /* Verificação caso o usuário não exista, retornando um error */
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    /* O bcrypt.compare() passado dentro do metodo checkPassword do usuário é assicrono
    por isso o uso do await dentro do if. Nesse caso, como queremos verificar se a senha
    não esta batendo, então negamos a comparação. */
    if (!(await user.checkPassword(password))) {
      return res.status(401).json({ error: 'Password does not match' });
    }

    /* Campos que vão ser retornados aparti do momento em que for feito o login */
    const { id, name } = user;
    /* Retornando os dados do usuário em JSON */
    return res.json({
      user: {
        id,
        name,
        email,
      },
      /* Gerar token. Primeiro campo passado, trata-se do pailoading (objeto) que são
      informações que queremos incorporar dentro do token, como por exemplo o id do
      usuario passado no exemplo. Segundo parametro trata-se de uma mensagem ou texto
      unico e seguro na aplicação. Terceiro parametros trata-se de configurações do token   */
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}

export default new SessionController();

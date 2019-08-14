import * as Yup from 'yup';
import User from '../models/User';

class UserController {
  /* Cadastro de Usuários */
  async store(req, res) {
    /* Validações */
    /* Validando um objeto, porque o req.body ou corpo da requisição é um objeto
    shape() -> Formato do objeto */
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .required()
        .min(6),
    });

    /* Verificando se o req.body, esta passando e validano conforme o schema passado */
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    /* Vou pegar os dados passados na requisição e comparar, para verificar se existe
    algum usuário com este mesmo email passado na requisição. */
    const userExists = await User.findOne({ where: { email: req.body.email } });

    /* Verificação caso exista, retornando um error */
    if (userExists) {
      return res.status(400).json({ error: 'User already exist ' });
    }

    /* Retornando apenas informações importantes */
    const { id, name, email, provider } = await User.create(req.body);
    /* Retornando um objeto com as informações selecionadas e desejadas */
    return res.json({
      id,
      name,
      email,
      provider,
    });
  }

  /* Atualização das informações do usuário */
  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string().min(6),
      /* Significa dizer que quando a password antigo for preenchido
      por obrigatoriedade, o password (nova senha) passa a ser obrigatorio. */
      password: Yup.string()
        .min(6)
        /* Lembrando que esse field, se refere ao password */
        .when('oldPassword', (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
      confirmPassword: Yup.string().when('password', (password, field) =>
        /* oneOf([Yup.ref('password')]) -> Para que o confirmPassword tenha o mesmo
        valor do password passado, referenciando o campo password. */
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
    });

    /* Verificando se o req.body, esta passando conforme o schema foi definido */
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    /* Recebendo os campos email e password */
    const { email, oldPassword } = req.body;

    /* Buscar usuário que esta querendo se identificar */
    const user = await User.findByPk(req.userId);

    /* Se o email que ele esta querendo alterar, for diferente do email que eu
    ja tenho, então eu busco um usuário com aquele email. Caso não encontre um
    erro é retornado */
    if (email !== user.email) {
      const userExist = await User.findOne({ where: { email } });

      if (userExist) {
        return res.status(400).json({ error: 'User already exist ' });
      }
    }

    /* Verificação se a senha passada no old_password, bate com a senha que o
    usuário ja tem salva. Nesse caso, a senha so é verificada, caso o usuário
    queira alterar sua senha, informando seu password antigo. */
    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ error: 'Password does not match' });
    }

    /* Dados que devem ser mostrados ao realizar a requisição */
    const { id, name, provider } = await user.update(req.body);
    return res.json({
      id,
      name,
      email,
      provider,
    });
  }
}

export default new UserController();

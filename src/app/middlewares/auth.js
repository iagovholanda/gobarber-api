import jwt from 'jsonwebtoken';
/* Biblioteca que vem padrão junto com o node. Função que pega uma função de
callback e transforma em uma função assincrona */
import { promisify } from 'util';

import authConfig from '../../config/auth';

/* Verificacao se o usuário esta ou não logado */
export default async (req, res, next) => {
  /* Buscando o header. O Authorization, trata-se do header
  que estamos buscando dentro do header. */
  const authHeader = req.headers.authorization;
  /* Se o token não foi enviado na requisição, ele retorna esse error */
  if (!authHeader) {
    return res.status(401).json({ error: 'Token not provided' });
  }

  /* Realizando a desestruturação, utilizando apenas o token passado.
  Na requisição o Bearer passa junto ao token. Como queremos apenas
  utilizar o token, separamos as informações. */
  const [, token] = authHeader.split(' ');

  try {
    /* Aqui transforma a função jwt.verify que é um callback em uma função
    assyncrona, passando o token da requisição, junto ao secret passado no
    no auth do config */
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);

    /* O usuário vai trazer todas as informações passadas anteriormente, como
    por exemplo o pailoading passado que foi o id do usuário passado no exemplo. */

    /* Incluir o id do usuário, dentro do nosso req. Isso vai servir por exemplo, para
    quando eu quiser atualizar um determinado usuário e ele ja estiver logado, eu não
    precisar passar o id na requisição e sim, receber esse id, por o usuário esta logado.
    Valor esse que veio declarado na auth no payloading. */
    req.userId = decoded.id;

    return next();
  } catch (err) {
    return res.json(401).json({ error: 'Token not provided' });
  }
};

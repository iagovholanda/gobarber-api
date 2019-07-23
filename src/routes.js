/* Router -> Uma forma de separar o roteamento do express em outro arquivos */
import { Router } from 'express';

const routes = new Router();

routes.get('/', (req, res) => {
  res.json({ message: 'Hello Rocketseat' });
});

export default routes;

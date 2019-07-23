import express from 'express';
import routes from './routes';

class App {
  /* Metodo construtor, executado sempre que a classe é instanciada */
  constructor() {
    this.server = express();

    this.middlewares();
    this.routes();
  }

  /* Cadastrar todas as middlewares para aplicação */
  middlewares() {
    this.server.use(express.json());
  }

  routes() {
    this.server.use(routes);
  }
}

/* Server -> Unica coisa que pode ser acessada da classe */
export default new App().server;

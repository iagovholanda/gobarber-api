import 'dotenv/config';

import express from 'express';
import path from 'path';

import Youch from 'youch';
import * as Sentry from '@sentry/node';
import 'express-async-errors';

import routes from './routes';
import sentryConfig from './config/sentry';

import './database';

class App {
  /* Metodo construtor, executado sempre que a classe é instanciada */
  constructor() {
    this.server = express();

    /* Configuração do Sentry */
    Sentry.init(sentryConfig);

    this.middlewares();
    this.routes();
    this.exceptionHandler();
  }

  /* Cadastrar todas as middlewares para aplicação */
  middlewares() {
    this.server.use(Sentry.Handlers.requestHandler());
    this.server.use(express.json());
    this.server.use(
      '/files',
      express.static(path.resolve(__dirname, '..', 'tmp', 'uploads'))
    );
  }

  routes() {
    this.server.use(routes);
    this.server.use(Sentry.Handlers.errorHandler());
  }

  exceptionHandler() {
    /* Middleware de tratamento de exceção dentro do express, em que o error
    sempre cai dentro deste middlewares, recebendo o err como primeiro parametro */
    this.server.use(async (err, req, res, next) => {
      /* Retornar estes erros apenas em ambiente de desenvolvimento */
      if (process.env.NODE_ENV === 'development') {
        const errors = await new Youch(err, req).toJSON();

        /* Error 500 - Error de servidor */
        return res.status(500).json(errors);
      }

      return res.json(500).json({ error: 'Internal server error' });
    });
  }
}

/* Server -> Unica coisa que pode ser acessada da classe */
export default new App().server;

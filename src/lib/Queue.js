import Bee from 'bee-queue';
import CancellationMail from '../app/jobs/CancellationMail';
import redisConfig from '../config/redis';

/* Todo novo job criado, deve ser passado dentro deste vetor. */
const jobs = [CancellationMail];

/* Resumidamente, estamos fazendo com os que os jobs da nossa aplicação
esteja armazenados dentro da variavel this.queues. */

class Queue {
  constructor() {
    /* Para cada job, a gente cria um fila. */
    this.queues = {};

    this.init();
  }

  init() {
    /* Percorrendo o vetor de jobs */
    jobs.forEach(({ key, handle }) => {
      this.queues[key] = {
        /* Para cada fila a gente armazena um bee, que é a instancia
        que se conecta com o redis. */
        bee: new Bee(key, {
          redis: redisConfig,
        }),
        /* Vai processar o nosso job, vai receber as informações cada
        vez que o job for processado, realizando suas tarefas que forem
        necessarias em background. */
        handle,
      };
    });
  }

  /* Metodo que adiciona novos jobs dentro de uma fila. Primeiro parametro a receber
  é o queue, que referece a fila que vou adicionar o job, e como segundo parametro
  vou receber os dados do job que desejo adicionar. */

  /* Toda vez que o um novo job for adicionado, o processQueue entra em ação e processa
  aquele job em background. */
  add(queue, job) {
    return this.queues[queue].bee.createJob(job).save();
  }

  /* Processando as filas */
  processQueue() {
    /* Percorre jobs */
    jobs.forEach(job => {
      const { bee, handle } = this.queues[job.key];

      /* Verificando falha nas filas. O on('failed') vai escutar os
      eventos de falha. */
      bee.on('failed', this.handleFailure).process(handle);
    });
  }

  /* Retorno do possivel error retornado da fila. */
  handleFailure(job, err) {
    console.log(`Queue ${job.queue.name}: FAILED`, err);
  }
}

export default new Queue();

import 'dotenv/config';

import Queue from './lib/Queue';

/* A execução da fila vai ser executada de forma diferente
de como é executada em node. */
Queue.processQueue();

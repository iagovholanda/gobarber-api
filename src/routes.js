/* Router -> Uma forma de separar o roteamento do express em outro arquivos */
import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

/* Importação Controllers */
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
import ProviderController from './app/controllers/ProviderController';

import authMiddleware from './app/middlewares/auth';
import AppointmentController from './app/controllers/AppointmentController';
import ScheduleController from './app/controllers/SheduleController';
import NotificationController from './app/controllers/NotificationController';
import AvailableController from './app/controllers/AvailableController';

const routes = new Router();
/* Variavel de upload que recebe o multer importado, junto as suas configurações */
const upload = multer(multerConfig);

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

/* Todas as rotas executadas abaixo desse comando, vão executar
a middlware declarada. */
routes.use(authMiddleware);

routes.put('/users', UserController.update);

/* Providers */
routes.get('/providers', ProviderController.index);
routes.get('/providers/:providerId/available', AvailableController.index);

/* Appointments */
routes.post('/appointments', AppointmentController.store);
routes.get('/appointments', AppointmentController.index);
routes.delete('/appointments/:id', AppointmentController.delete);

/* Agenda - Provider */
routes.get('/schedule', ScheduleController.index);

/* Listagem de Notificações */
routes.get('/notifications', NotificationController.index);
routes.put('/notifications/:id', NotificationController.update);

/* upload.single('file') -> Upload de um arquivo por vez
file -> Nome do campo enviado dentro da requisição */
routes.post('/files', upload.single('file'), FileController.store);

export default routes;

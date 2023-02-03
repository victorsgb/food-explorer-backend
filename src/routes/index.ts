// Core dependencies
import { Router } from 'express';
import sessionsRoutes from './sessions.routes';
import usersRoutes from './users.routes';

const router = Router();

const routes: any[] = [
  router.use('/sessions', sessionsRoutes),
  router.use('/users', usersRoutes)
];

export default routes;


// Core dependencies
import { Router } from 'express';

// Imported routes
import sessionsRoutes from './sessions.routes';
import usersRoutes from './users.routes';
import categoriesRoutes from './categories.routes';
import dishesRoutes from './dishes.routes';
import ingredientsRoutes from './ingredients.routes';

const router = Router();

const routes: any[] = [
  router.use('/sessions', sessionsRoutes),
  router.use('/users', usersRoutes),
  router.use('/categories', categoriesRoutes),
  router.use('/dishes', dishesRoutes),
  router.use('/ingredients', ingredientsRoutes)
];

export default routes;


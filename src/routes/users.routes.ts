// Core dependencies
import { Router } from 'express';
import UsersController from '../controllers/UsersControllers';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const usersController = new UsersController();
const usersRoutes = Router();

// Route to create user
usersRoutes.post('/', usersController.create);
// Route to update user
usersRoutes.put('/', ensureAuthenticated, usersController.update);
// Route to fetch some data from user
usersRoutes.get('/:id', ensureAuthenticated, usersController.show);

export default usersRoutes;
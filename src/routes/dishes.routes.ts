// Core dependencies
import { Router } from 'express';
import multer = require('multer');

// Custom controllers and configs
import DishesController from '../controllers/DishesController';
import { MULTER } from '../configs/upload';

// Custom middlewares
import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const upload = multer(MULTER);

const dishesController = new DishesController();
const dishesRoutes = Router();

// Route to create dish
dishesRoutes.post('/', ensureAuthenticated, upload.single('image'), dishesController.create);
// Route to update dish
dishesRoutes.put('/:id', ensureAuthenticated, upload.single('image'), dishesController.update);
// Route to index dishes
dishesRoutes.get('/', ensureAuthenticated, dishesController.index);
// Route to show data from a given dish
dishesRoutes.get('/:id', ensureAuthenticated, dishesController.show);
// Route to delete dish
dishesRoutes.delete('/:id', ensureAuthenticated, dishesController.delete);

export default dishesRoutes;
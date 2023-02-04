// Core dependencies
import { Router } from 'express';
import multer from 'multer';

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

export default dishesRoutes;
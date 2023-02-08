// Core dependencies
import { Router } from 'express';

// Custom controllers and configs
import IngredientsController from '../controllers/IngredientsController';

// Custom middlewares
import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const ingredientsController = new IngredientsController();
const dishesRoutes = Router();

// Route to index ingredients from a given dish
dishesRoutes.get('/:dish_id', ensureAuthenticated, ingredientsController.index);

export default dishesRoutes;

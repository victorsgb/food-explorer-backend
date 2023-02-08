// Core dependencies
import { Router } from 'express';

// Custom controllers
import CategoriesController from '../controllers/CategoriesController';

// Custom middlewares
import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const categoriesController = new CategoriesController();
const categoriesRoutes = Router();

// Route to create categories from entries in database/files/categories.csv
categoriesRoutes.post('/from_csv', categoriesController.create_from_csv);
// Route to index categories
categoriesRoutes.get('/', ensureAuthenticated, categoriesController.index);

export default categoriesRoutes;
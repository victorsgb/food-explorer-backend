// Core dependencies
import { Router } from 'express';

// Custom controllers
import CategoriesController from '../controllers/CategoriesController';

const categoriesController = new CategoriesController();
const categoriesRoutes = Router();

// Route to create categories from entries in database/files/categories.csv
categoriesRoutes.post('/from_csv', categoriesController.create_from_csv);

export default categoriesRoutes;
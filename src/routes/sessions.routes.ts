// Core dependencies
import { Router } from 'express';

// Custom controllers
import SessionsController from '../controllers/SessionsController';

const sessionsController = new SessionsController();
const sessionsRoutes = Router();

// Route to create new session
sessionsRoutes.post('/', sessionsController.create);

export default sessionsRoutes;
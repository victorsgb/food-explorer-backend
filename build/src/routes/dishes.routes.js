"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Core dependencies
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
// Custom controllers and configs
const DishesController_1 = __importDefault(require("../controllers/DishesController"));
const upload_1 = require("../configs/upload");
// Custom middlewares
const ensureAuthenticated_1 = __importDefault(require("../middlewares/ensureAuthenticated"));
const upload = (0, multer_1.default)(upload_1.MULTER);
const dishesController = new DishesController_1.default();
const dishesRoutes = (0, express_1.Router)();
// Route to create dish
dishesRoutes.post('/', ensureAuthenticated_1.default, upload.single('image'), dishesController.create);
// Route to update dish
dishesRoutes.put('/:id', ensureAuthenticated_1.default, upload.single('image'), dishesController.update);
// Route to index dishes
dishesRoutes.get('/', ensureAuthenticated_1.default, dishesController.index);
// Route to show data from a given dish
dishesRoutes.get('/:id', ensureAuthenticated_1.default, dishesController.show);
// Route to delete dish
dishesRoutes.delete('/:id', ensureAuthenticated_1.default, dishesController.delete);
exports.default = dishesRoutes;

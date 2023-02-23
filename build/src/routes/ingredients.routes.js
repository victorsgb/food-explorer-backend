"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Core dependencies
const express_1 = require("express");
// Custom controllers and configs
const IngredientsController_1 = __importDefault(require("../controllers/IngredientsController"));
// Custom middlewares
const ensureAuthenticated_1 = __importDefault(require("../middlewares/ensureAuthenticated"));
const ingredientsController = new IngredientsController_1.default();
const dishesRoutes = (0, express_1.Router)();
// Route to index ingredients from a given dish
dishesRoutes.get('/:dish_id', ensureAuthenticated_1.default, ingredientsController.index);
exports.default = dishesRoutes;

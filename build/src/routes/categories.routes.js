"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Core dependencies
const express_1 = require("express");
// Custom controllers
const CategoriesController_1 = __importDefault(require("../controllers/CategoriesController"));
// Custom middlewares
const ensureAuthenticated_1 = __importDefault(require("../middlewares/ensureAuthenticated"));
const categoriesController = new CategoriesController_1.default();
const categoriesRoutes = (0, express_1.Router)();
// Route to create categories from entries in database/files/categories.csv
categoriesRoutes.post('/from_csv', categoriesController.create_from_csv);
// Route to index categories
categoriesRoutes.get('/', ensureAuthenticated_1.default, categoriesController.index);
exports.default = categoriesRoutes;

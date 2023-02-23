"use strict";
exports.__esModule = true;
// Core dependencies
var express_1 = require("express");
// Custom controllers
var CategoriesController_1 = require("../controllers/CategoriesController");
// Custom middlewares
var ensureAuthenticated_1 = require("../middlewares/ensureAuthenticated");
var categoriesController = new CategoriesController_1["default"]();
var categoriesRoutes = (0, express_1.Router)();
// Route to create categories from entries in database/files/categories.csv
categoriesRoutes.post('/from_csv', categoriesController.create_from_csv);
// Route to index categories
categoriesRoutes.get('/', ensureAuthenticated_1["default"], categoriesController.index);
exports["default"] = categoriesRoutes;

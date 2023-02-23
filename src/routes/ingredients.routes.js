"use strict";
exports.__esModule = true;
// Core dependencies
var express_1 = require("express");
// Custom controllers and configs
var IngredientsController_1 = require("../controllers/IngredientsController");
// Custom middlewares
var ensureAuthenticated_1 = require("../middlewares/ensureAuthenticated");
var ingredientsController = new IngredientsController_1["default"]();
var dishesRoutes = (0, express_1.Router)();
// Route to index ingredients from a given dish
dishesRoutes.get('/:dish_id', ensureAuthenticated_1["default"], ingredientsController.index);
exports["default"] = dishesRoutes;

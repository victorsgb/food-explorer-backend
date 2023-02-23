"use strict";
exports.__esModule = true;
// Core dependencies
var express_1 = require("express");
var multer = require("multer");
// Custom controllers and configs
var DishesController_1 = require("../controllers/DishesController");
var upload_1 = require("../configs/upload");
// Custom middlewares
var ensureAuthenticated_1 = require("../middlewares/ensureAuthenticated");
var upload = multer(upload_1.MULTER);
var dishesController = new DishesController_1["default"]();
var dishesRoutes = (0, express_1.Router)();
// Route to create dish
dishesRoutes.post('/', ensureAuthenticated_1["default"], upload.single('image'), dishesController.create);
// Route to update dish
dishesRoutes.put('/:id', ensureAuthenticated_1["default"], upload.single('image'), dishesController.update);
// Route to index dishes
dishesRoutes.get('/', ensureAuthenticated_1["default"], dishesController.index);
// Route to show data from a given dish
dishesRoutes.get('/:id', ensureAuthenticated_1["default"], dishesController.show);
// Route to delete dish
dishesRoutes["delete"]('/:id', ensureAuthenticated_1["default"], dishesController["delete"]);
exports["default"] = dishesRoutes;

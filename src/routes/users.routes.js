"use strict";
exports.__esModule = true;
// Core dependencies
var express_1 = require("express");
// Custom controllers
var UsersController_1 = require("../controllers/UsersController");
// Custom middlewares
var ensureAuthenticated_1 = require("../middlewares/ensureAuthenticated");
var usersController = new UsersController_1["default"]();
var usersRoutes = (0, express_1.Router)();
// Route to create user
usersRoutes.post('/', usersController.create);
// Route to update user
usersRoutes.put('/', ensureAuthenticated_1["default"], usersController.update);
// Route to fetch some data from user
usersRoutes.get('/:id', ensureAuthenticated_1["default"], usersController.show);
exports["default"] = usersRoutes;

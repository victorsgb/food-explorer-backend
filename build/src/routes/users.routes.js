"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Core dependencies
const express_1 = require("express");
// Custom controllers
const UsersController_1 = __importDefault(require("../controllers/UsersController"));
// Custom middlewares
const ensureAuthenticated_1 = __importDefault(require("../middlewares/ensureAuthenticated"));
const usersController = new UsersController_1.default();
const usersRoutes = (0, express_1.Router)();
// Route to create user
usersRoutes.post('/', usersController.create);
// Route to update user
usersRoutes.put('/', ensureAuthenticated_1.default, usersController.update);
// Route to fetch some data from user
usersRoutes.get('/:id', ensureAuthenticated_1.default, usersController.show);
exports.default = usersRoutes;

"use strict";
exports.__esModule = true;
// Core dependencies
var express_1 = require("express");
// Custom controllers
var SessionsController_1 = require("../controllers/SessionsController");
var sessionsController = new SessionsController_1["default"]();
var sessionsRoutes = (0, express_1.Router)();
// Route to create new session
sessionsRoutes.post('/', sessionsController.create);
exports["default"] = sessionsRoutes;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Core dependencies
const express_1 = require("express");
// Custom controllers
const SessionsController_1 = __importDefault(require("../controllers/SessionsController"));
const sessionsController = new SessionsController_1.default();
const sessionsRoutes = (0, express_1.Router)();
// Route to create new session
sessionsRoutes.post('/', sessionsController.create);
exports.default = sessionsRoutes;

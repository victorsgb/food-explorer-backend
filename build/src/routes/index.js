"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Core dependencies
const express_1 = require("express");
// Imported routes
const sessions_routes_1 = __importDefault(require("./sessions.routes"));
const users_routes_1 = __importDefault(require("./users.routes"));
const categories_routes_1 = __importDefault(require("./categories.routes"));
const dishes_routes_1 = __importDefault(require("./dishes.routes"));
const ingredients_routes_1 = __importDefault(require("./ingredients.routes"));
const router = (0, express_1.Router)();
const routes = [
    router.use('/sessions', sessions_routes_1.default),
    router.use('/users', users_routes_1.default),
    router.use('/categories', categories_routes_1.default),
    router.use('/dishes', dishes_routes_1.default),
    router.use('/ingredients', ingredients_routes_1.default)
];
exports.default = routes;

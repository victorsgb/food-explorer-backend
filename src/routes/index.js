"use strict";
exports.__esModule = true;
// Core dependencies
var express_1 = require("express");
// Imported routes
var sessions_routes_1 = require("./sessions.routes");
var users_routes_1 = require("./users.routes");
var categories_routes_1 = require("./categories.routes");
var dishes_routes_1 = require("./dishes.routes");
var ingredients_routes_1 = require("./ingredients.routes");
var router = (0, express_1.Router)();
var routes = [
    router.use('/sessions', sessions_routes_1["default"]),
    router.use('/users', users_routes_1["default"]),
    router.use('/categories', categories_routes_1["default"]),
    router.use('/dishes', dishes_routes_1["default"]),
    router.use('/ingredients', ingredients_routes_1["default"])
];
exports["default"] = routes;

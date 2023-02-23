"use strict";
exports.__esModule = true;
var knexfile_1 = require("../../../knexfile");
var knex_1 = require("knex");
var connection = (0, knex_1["default"])(knexfile_1["default"].development);
exports["default"] = connection;

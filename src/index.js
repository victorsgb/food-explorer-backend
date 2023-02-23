"use strict";
exports.__esModule = true;
// Core dependencies
require('express-async-errors');
require('dotenv/config');
var cors = require("cors");
var express = require("express");
var routes_1 = require("../src/routes");
var AppError_1 = require("../src/utils/AppError");
var upload_1 = require("./configs/upload");
var app = express();
app.use(cors());
app.use(express.json());
app.use('/files', express.static(upload_1.UPLOADS_FOLDER));
app.use(routes_1["default"]);
app.use(function (error, request, response, next) {
    if (error instanceof AppError_1["default"]) {
        return response.status(error.statusCode).json({
            'status': 'error',
            'message': error.message
        });
    }
    return response.status(500).json({
        'status': 'error',
        'message': 'Erro interno no servidor'
    });
});
var PORT = process.env.PORT || 3336;
app.listen(PORT, function () {
    console.log("Servidor rodando na porta ".concat(PORT));
});

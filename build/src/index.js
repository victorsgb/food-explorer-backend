"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Core dependencies
require('express-async-errors');
require('dotenv/config');
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const routes_1 = __importDefault(require("../src/routes"));
const AppError_1 = __importDefault(require("../src/utils/AppError"));
const upload_1 = require("./configs/upload");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/files', express_1.default.static(upload_1.UPLOADS_FOLDER));
app.use(routes_1.default);
app.use((error, request, response, next) => {
    if (error instanceof AppError_1.default) {
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
const PORT = process.env.PORT || 3336;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

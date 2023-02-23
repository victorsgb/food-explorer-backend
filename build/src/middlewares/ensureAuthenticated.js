"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Core dependencies
const jsonwebtoken_1 = require("jsonwebtoken");
const AppError_1 = __importDefault(require("../utils/AppError"));
const auth_1 = __importDefault(require("../configs/auth"));
function ensureAuthenticated(request, response, next) {
    const authHeader = request.headers.authorization;
    if (!authHeader) {
        throw new AppError_1.default('JWT Token não encontrado!', 401);
    }
    const [, token] = authHeader.split(' ');
    try {
        const { sub: user_id } = (0, jsonwebtoken_1.verify)(token, auth_1.default.jwt.secret);
        request.user = {
            id: Number(user_id)
        };
        return next();
    }
    catch (_a) {
        throw new AppError_1.default('JWT Token inválido!', 401);
    }
}
exports.default = ensureAuthenticated;

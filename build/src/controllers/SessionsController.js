"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Core dependencies
const knex_1 = __importDefault(require("../database/knex"));
const bcryptjs_1 = require("bcryptjs");
const jsonwebtoken_1 = require("jsonwebtoken");
// Custom utils and configs
const auth_1 = __importDefault(require("../configs/auth"));
const AppError_1 = __importDefault(require("../utils/AppError"));
class SessionsController {
    create(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            /* Method meant for creating a login session. It retrieves email and password from the body of the request and checks if these belong to any user on database. If a match is found, then data from this user is sent back to the requester, along with a token */
            const { email, password } = request.body;
            // Both email and password are mandatory
            if (!email || !password) {
                throw new AppError_1.default('E-mail e/ou senha não fornecido(s)! Processo abortado.', 401);
            }
            const validUser = yield (0, knex_1.default)('users')
                .where({ email })
                .first();
            if (!validUser) {
                throw new AppError_1.default('E-mail e/ou senha incorretos! Tente novamente.', 401);
            }
            const passwordMatched = yield (0, bcryptjs_1.compare)(password, validUser.password);
            if (!passwordMatched) {
                throw new AppError_1.default('E-mail e/ou senha incorretos! Tente novamente.', 401);
            }
            const { secret, expiresIn } = auth_1.default.jwt;
            const token = (0, jsonwebtoken_1.sign)({}, secret, {
                subject: String(validUser.id),
                expiresIn
            });
            return response.json({
                user: {
                    id: validUser.id,
                    admin: validUser.admin,
                    name: validUser.name,
                    email: validUser.email,
                    created_at: validUser.created_at,
                    updated_at: validUser.updated_at,
                },
                token
            });
        });
    }
}
exports.default = SessionsController;

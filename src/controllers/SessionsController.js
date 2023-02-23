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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
// Core dependencies
var knex_1 = require("../database/knex");
var bcryptjs_1 = require("bcryptjs");
var jsonwebtoken_1 = require("jsonwebtoken");
// Custom utils and configs
var auth_1 = require("../configs/auth");
var AppError_1 = require("../utils/AppError");
var SessionsController = /** @class */ (function () {
    function SessionsController() {
    }
    SessionsController.prototype.create = function (request, response) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, email, password, validUser, passwordMatched, _b, secret, expiresIn, token;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = request.body, email = _a.email, password = _a.password;
                        // Both email and password are mandatory
                        if (!email || !password) {
                            throw new AppError_1["default"]('E-mail e/ou senha não fornecido(s)! Processo abortado.', 401);
                        }
                        return [4 /*yield*/, (0, knex_1["default"])('users')
                                .where({ email: email })
                                .first()];
                    case 1:
                        validUser = _c.sent();
                        if (!validUser) {
                            throw new AppError_1["default"]('E-mail e/ou senha incorretos! Tente novamente.', 401);
                        }
                        return [4 /*yield*/, (0, bcryptjs_1.compare)(password, validUser.password)];
                    case 2:
                        passwordMatched = _c.sent();
                        if (!passwordMatched) {
                            throw new AppError_1["default"]('E-mail e/ou senha incorretos! Tente novamente.', 401);
                        }
                        _b = auth_1["default"].jwt, secret = _b.secret, expiresIn = _b.expiresIn;
                        token = (0, jsonwebtoken_1.sign)({}, secret, {
                            subject: String(validUser.id),
                            expiresIn: expiresIn
                        });
                        return [2 /*return*/, response.json({
                                user: {
                                    id: validUser.id,
                                    admin: validUser.admin,
                                    name: validUser.name,
                                    email: validUser.email,
                                    created_at: validUser.created_at,
                                    updated_at: validUser.updated_at
                                },
                                token: token
                            })];
                }
            });
        });
    };
    return SessionsController;
}());
exports["default"] = SessionsController;

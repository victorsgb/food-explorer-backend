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
//Custom utils
var AppError_1 = require("../utils/AppError");
var bcryptSalt = process.env.BCRYPT_SALT;
var UsersController = /** @class */ (function () {
    function UsersController() {
    }
    UsersController.prototype.create = function (request, response) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, name, email, password, emailAlreadyInUse, hashedPassword;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = request.body, name = _a.name, email = _a.email, password = _a.password;
                        // Check if all fields exist
                        if (!name || !email || !password) {
                            throw new AppError_1["default"]('Nem todos os campos foram preenchidos! Processo abortado.', 401);
                        }
                        return [4 /*yield*/, (0, knex_1["default"])('users')
                                .where({ email: email }).first()];
                    case 1:
                        emailAlreadyInUse = _b.sent();
                        if (emailAlreadyInUse) {
                            throw new AppError_1["default"]('E-mail inválido - já se encontra cadastrado por outro(a) usuário(a)!', 401);
                        }
                        return [4 /*yield*/, (0, bcryptjs_1.hash)(password, Number(bcryptSalt))];
                    case 2:
                        hashedPassword = _b.sent();
                        // Inserting new user into database - only non-admin users can be created following this route - we're assuming users are set as admin directly on the database.
                        return [4 /*yield*/, (0, knex_1["default"])('users').insert({
                                admin: false,
                                name: name,
                                email: email,
                                password: hashedPassword
                            })];
                    case 3:
                        // Inserting new user into database - only non-admin users can be created following this route - we're assuming users are set as admin directly on the database.
                        _b.sent();
                        return [2 /*return*/, response.json()];
                }
            });
        });
    };
    UsersController.prototype.update = function (request, response) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var id, isValidUser, _b, name, email, password, isEmailInUse, hashedPassword, oldPassword, oldPasswordMatches;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        id = (_a = request.user) === null || _a === void 0 ? void 0 : _a.id;
                        if (!id) {
                            throw new AppError_1["default"]('Usuário(a) não autenticado(a) corretamente!', 401);
                        }
                        return [4 /*yield*/, (0, knex_1["default"])('users')
                                .where({ id: id })
                                .first()];
                    case 1:
                        isValidUser = _c.sent();
                        if (!isValidUser) {
                            throw new AppError_1["default"]('Usuário(a) não encontrado(a) no banco de dados!', 401);
                        }
                        _b = request.body, name = _b.name, email = _b.email, password = _b.password;
                        if (!email) return [3 /*break*/, 3];
                        return [4 /*yield*/, (0, knex_1["default"])('users')
                                .where({ email: email })
                                .whereNot({ id: id })
                                .first()];
                    case 2:
                        isEmailInUse = _c.sent();
                        if (isEmailInUse) {
                            throw new AppError_1["default"]('E-mail inválido - já cadastrado no banco de dados por outro usuário(a)!', 401);
                        }
                        _c.label = 3;
                    case 3:
                        hashedPassword = undefined;
                        if (!password) return [3 /*break*/, 6];
                        oldPassword = request.body.oldPassword;
                        if (!oldPassword) {
                            throw new AppError_1["default"]('Não é possível atualizar a senha sem fornecer uma senha antiga. Processo de atualização de cadastro abortado.', 401);
                        }
                        return [4 /*yield*/, (0, bcryptjs_1.compare)(oldPassword, isValidUser.password)];
                    case 4:
                        oldPasswordMatches = _c.sent();
                        if (!oldPasswordMatches) {
                            throw new AppError_1["default"]('Senha atual não confere! Processo de atualização de cadastro abortado.', 401);
                        }
                        return [4 /*yield*/, (0, bcryptjs_1.hash)(password, Number(bcryptSalt))];
                    case 5:
                        // When the old password matches, we can now encrypt the new password and pass in on
                        hashedPassword = _c.sent();
                        _c.label = 6;
                    case 6: 
                    // Finally update the user. We do not need to worry about empty fields, since undefined fields are ignored by knex.update({...})
                    return [4 /*yield*/, (0, knex_1["default"])('users')
                            .where({ id: id })
                            .update({
                            name: name,
                            email: email,
                            password: hashedPassword,
                            updated_at: knex_1["default"].fn.now()
                        })];
                    case 7:
                        // Finally update the user. We do not need to worry about empty fields, since undefined fields are ignored by knex.update({...})
                        _c.sent();
                        return [2 /*return*/, response.json()];
                }
            });
        });
    };
    UsersController.prototype.show = function (request, response) {
        return __awaiter(this, void 0, void 0, function () {
            var id, validUser;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = request.params.id;
                        return [4 /*yield*/, (0, knex_1["default"])('users')
                                .select([
                                'admin',
                                'name',
                                'email',
                                'created_at',
                                'updated_at'
                            ])
                                .where({ id: id })
                                .first()];
                    case 1:
                        validUser = _a.sent();
                        if (!validUser) {
                            throw new AppError_1["default"]('Usuário(a) não encontrado(a)!', 401);
                        }
                        return [2 /*return*/, response.json(validUser)];
                }
            });
        });
    };
    return UsersController;
}());
exports["default"] = UsersController;

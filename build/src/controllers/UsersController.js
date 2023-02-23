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
//Custom utils
const AppError_1 = __importDefault(require("../utils/AppError"));
const bcryptSalt = process.env.BCRYPT_SALT;
class UsersController {
    create(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            /* Method for creating a new user, i.e, inserting data into table 'users'. Data to be sent is name, email, and password, retrieved from request.body. Email must be unique but there is no password restriction on backend */
            // Get data from body of request
            const { name, email, password } = request.body;
            // Check if all fields exist
            if (!name || !email || !password) {
                throw new AppError_1.default('Nem todos os campos foram preenchidos! Processo abortado.', 401);
            }
            // Check if email is already in use since it must be unique
            const emailAlreadyInUse = yield (0, knex_1.default)('users')
                .where({ email }).first();
            if (emailAlreadyInUse) {
                throw new AppError_1.default('E-mail inválido - já se encontra cadastrado por outro(a) usuário(a)!', 401);
            }
            const hashedPassword = yield (0, bcryptjs_1.hash)(password, Number(bcryptSalt));
            // Inserting new user into database - only non-admin users can be created following this route - we're assuming users are set as admin directly on the database.
            yield (0, knex_1.default)('users').insert({
                admin: false,
                name,
                email,
                password: hashedPassword
            });
            return response.json();
        });
    }
    update(request, response) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            /* Method for update of some data of a given user, assuming he/she is is authenticated. Data to be updated is name, email and/or password. Email must be unique and password is only updated if user provided its current password. */
            // Assuming user is authenticated means that request.user.id exists...
            const id = (_a = request.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!id) {
                throw new AppError_1.default('Usuário(a) não autenticado(a) corretamente!', 401);
            }
            const isValidUser = yield (0, knex_1.default)('users')
                .where({ id })
                .first();
            if (!isValidUser) {
                throw new AppError_1.default('Usuário(a) não encontrado(a) no banco de dados!', 401);
            }
            // Since user is authenticated and found on the database, we can now retrieve its new data from the body of request. Not all fields must be filled; name can be undefined, for example.
            const { name, email, password } = request.body;
            // If email is provided, check if new email is not currently in use by another user
            if (email) {
                const isEmailInUse = yield (0, knex_1.default)('users')
                    .where({ email })
                    .whereNot({ id })
                    .first();
                if (isEmailInUse) {
                    throw new AppError_1.default('E-mail inválido - já cadastrado no banco de dados por outro usuário(a)!', 401);
                }
            }
            // If password is provided, let's retrieve the old password from the body of the request, to ensure the user knows it for security measures
            let hashedPassword = undefined;
            if (password) {
                const { oldPassword } = request.body;
                if (!oldPassword) {
                    throw new AppError_1.default('Não é possível atualizar a senha sem fornecer uma senha antiga. Processo de atualização de cadastro abortado.', 401);
                }
                const oldPasswordMatches = yield (0, bcryptjs_1.compare)(oldPassword, isValidUser.password);
                if (!oldPasswordMatches) {
                    throw new AppError_1.default('Senha atual não confere! Processo de atualização de cadastro abortado.', 401);
                }
                // When the old password matches, we can now encrypt the new password and pass in on
                hashedPassword = yield (0, bcryptjs_1.hash)(password, Number(bcryptSalt));
            }
            // Finally update the user. We do not need to worry about empty fields, since undefined fields are ignored by knex.update({...})
            yield (0, knex_1.default)('users')
                .where({ id })
                .update({
                name,
                email,
                password: hashedPassword,
                updated_at: knex_1.default.fn.now()
            });
            return response.json();
        });
    }
    show(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            /* Method meant for exhibiting some data from user of a given id, sent via route params */
            const { id } = request.params;
            // Notice we're omitting user's password to be retrieved, for security measures 
            const validUser = yield (0, knex_1.default)('users')
                .select([
                'admin',
                'name',
                'email',
                'created_at',
                'updated_at'
            ])
                .where({ id })
                .first();
            if (!validUser) {
                throw new AppError_1.default('Usuário(a) não encontrado(a)!', 401);
            }
            return response.json(validUser);
        });
    }
}
exports.default = UsersController;

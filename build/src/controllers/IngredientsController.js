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
// Custom utils
const AppError_1 = __importDefault(require("../utils/AppError"));
class IngredientsController {
    index(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            /* Method for indexing all ingredients from a given dish. The client must provide a valid dish id via route params.
        
            User must be authenticated for safety reasons.*/
            // Ensure user authentication
            if (!request.user) {
                throw new AppError_1.default('Usuário(a) deve estar autenticado(a) para indexar pratos!', 401);
            }
            // Retrieve dish id from route params
            const { dish_id } = request.params;
            const ingredients = yield (0, knex_1.default)('ingredients')
                .where({ dish_id })
                .then(items => items.map(item => item.ingredient));
            return response.json(ingredients);
        });
    }
}
exports.default = IngredientsController;

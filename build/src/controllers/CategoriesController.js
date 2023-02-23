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
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const csv_parse_1 = require("csv-parse");
// Custom utils
const AppError_1 = __importDefault(require("../utils/AppError"));
class CategoriesController {
    create_from_csv(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            /* Method meant for inserting several entries into the 'categories' table at once. It expects a file called categories.csv, which must be a single column of data. First row, i.e, the title, is skipped from reading. */
            fs_1.default.createReadStream(path_1.default.resolve(__dirname, '..', 'database', 'files', 'categories.csv'))
                .pipe((0, csv_parse_1.parse)({ delimiter: ',', from_line: 2 }))
                .on('data', row => {
                function insertCategoryIntoDatabase(category) {
                    return __awaiter(this, void 0, void 0, function* () {
                        // Ensure category entry exists
                        if (!category) {
                            return;
                        }
                        // Ensure category entry is unique
                        const categoryIsAlreadyInDatabase = yield (0, knex_1.default)('categories')
                            .where({ category })
                            .first();
                        if (categoryIsAlreadyInDatabase) {
                            return;
                        }
                        // Since entry is unique, we can safely insert it into the database:
                        const response = yield (0, knex_1.default)('categories')
                            .insert({ category });
                        console.log(`Entry ${response} inserted into 'categories' table. Category: ${category}`);
                    });
                }
                insertCategoryIntoDatabase(row);
            })
                .on('error', error => {
                throw new AppError_1.default(error.message);
            })
                .on('end', () => {
                console.log('finished');
            });
            return response.json();
        });
    }
    index(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            /* Method for indexing all categories at once.
            
            User must be authenticated for safety reasons.*/
            // Ensure user authentication
            if (!request.user) {
                throw new AppError_1.default('Usuário(a) deve estar autenticado(a) para indexar pratos!', 401);
            }
            const categories = yield (0, knex_1.default)('categories');
            return response.json(categories);
        });
    }
}
exports.default = CategoriesController;

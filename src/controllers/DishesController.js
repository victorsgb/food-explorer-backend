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
// Custom utils and providers
var AppError_1 = require("../utils/AppError");
var Helpers_1 = require("../utils/Helpers");
var DiskStorage_1 = require("../providers/DiskStorage");
var DishesController = /** @class */ (function () {
    function DishesController() {
    }
    DishesController.prototype.create = function (request, response) {
        return __awaiter(this, void 0, void 0, function () {
            var userIsAdmin, category, isValidCategory, image, _a, dish, ingredients, cost, description, ingredientsItems, helpers, _b, reais, cents, dish_id, _i, ingredientsItems_1, ingredient, diskStorage;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        /* Method for creating a new dish, i.e, inserting data into table 'dishes'. Data inserted into this table are category_id, dish (its name), description, image path, and the dish's cost.
                        
                        The client provides category string, which must be validated in order to return the corresponding category_id. The cost is received as a float by the client, but stored in two distinct numeric fields, reais and cents, to avoid imprecision.
                        
                        Besides, each dish has many ingredients, with its corresponding data coming as an array of strings. Each item is inserted into the 'ingredients' table, referencing the newly created dish by its id.
                        
                        User must be an authenticated admin, for security, which means request.user exists and this user's entry exists in the 'users' table as well.
                        
                        A middleware exists to ensure that, before this method is called, the image sent by the client has been uploaded into the tmp folder. So, this method also transfers this image into the uploads folder, if everything is O.K. */
                        // Ensure user authentication
                        if (!request.user) {
                            throw new AppError_1["default"]('Usuário(a) deve estar autenticado(a) para cadastrar pratos!', 401);
                        }
                        return [4 /*yield*/, (0, knex_1["default"])('users')
                                .where({ id: request.user.id })
                                .first()
                                .then(function (user) { return user.admin; })];
                    case 1:
                        userIsAdmin = _c.sent();
                        if (!userIsAdmin) {
                            throw new AppError_1["default"]('Usuário(a) precisa ter privilégios de administrador para cadastrar um novo prato!', 401);
                        }
                        category = request.query.category;
                        // Check if category string is not null/undefined
                        if (!category) {
                            throw new AppError_1["default"]('Nenhuma categoria foi enviada para o servidor. Processo abortado!', 401);
                        }
                        return [4 /*yield*/, (0, knex_1["default"])('categories')
                                .where({ category: category })
                                .first()];
                    case 2:
                        isValidCategory = _c.sent();
                        if (!isValidCategory) {
                            throw new AppError_1["default"]('Categoria inválida! Processo abortado.', 401);
                        }
                        // Now we can retrieve the image sent by the client. It must be on the tmp folder if middleware succeeded and must be moved to the uploads folder, where it will be available for the client.
                        if (!request.file) {
                            throw new AppError_1["default"]('Nenhuma imagem enviada pelo cliente! Processo abortado!', 401);
                        }
                        image = request.file.filename;
                        _a = request.query, dish = _a.dish, ingredients = _a.ingredients, cost = _a.cost, description = _a.description;
                        // Ensure that all fields above aren't blank
                        if (!dish || !ingredients || !cost || !description) {
                            throw new AppError_1["default"]('Algum campo fora encontrado vazio. Processo abortado!', 401);
                        }
                        ingredientsItems = ingredients.split(',');
                        helpers = new Helpers_1["default"]();
                        if (!helpers.checkArrayOfStrings(ingredientsItems)) {
                            throw new AppError_1["default"]('Algum ingrediente inválido encontrado! Abortando processo.', 401);
                        }
                        _b = cost.split('.'), reais = _b[0], cents = _b[1];
                        return [4 /*yield*/, (0, knex_1["default"])('dishes')
                                .insert({
                                category_id: isValidCategory.id,
                                dish: dish,
                                description: description,
                                image: image,
                                reais: reais,
                                cents: cents.padEnd(2, '0')
                            })];
                    case 3:
                        dish_id = _c.sent();
                        _i = 0, ingredientsItems_1 = ingredientsItems;
                        _c.label = 4;
                    case 4:
                        if (!(_i < ingredientsItems_1.length)) return [3 /*break*/, 7];
                        ingredient = ingredientsItems_1[_i];
                        return [4 /*yield*/, (0, knex_1["default"])('ingredients')
                                .insert({
                                dish_id: dish_id,
                                ingredient: ingredient
                            })];
                    case 5:
                        _c.sent();
                        _c.label = 6;
                    case 6:
                        _i++;
                        return [3 /*break*/, 4];
                    case 7:
                        diskStorage = new DiskStorage_1["default"]();
                        return [4 /*yield*/, diskStorage.saveFile(image)];
                    case 8:
                        _c.sent();
                        return [2 /*return*/, response.json()];
                }
            });
        });
    };
    DishesController.prototype.update = function (request, response) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var id, isValidDish, category, isValidCategory, image, _b, dish, ingredients, cost, description, ingredientsItems, helpers, reais, cents, ingredientsToBeDeletedIds, ingredientsToBeSkipped, _i, ingredientsItems_2, ingredient, diskStorage;
            var _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        /* Method for updating an existing dish, i.e, overriding entry from table 'dishes'. The client provides the dish_id of the dish of interest, as well as the new data to override existing information.
                        
                        Data updated may be category_id, dish (its name), description, image path, and the dish's cost.
                        
                        If the client provides a category string, it must be validated in order to return the corresponding category_id.
                        
                        If the client provides ingredients, then all existing ingredients that are not present in the new ingredients array must be wiped away, while only ingredients that are new must be inserted into the appropriate table.
                    
                        User must be authenticated, for security, which means request.user exists.
                        
                        A middleware exists to ensure that, before this method is called, the image sent by the client has been uploaded into the tmp folder. So, this method also transfers this image into the uploads folder, if everything is O.K. Hence, the old image must be deleted from the server before moving the new one into the server. */
                        // Ensure user authentication
                        if (!request.user) {
                            throw new AppError_1["default"]('Usuário(a) deve estar autenticado(a) para cadastrar pratos!', 401);
                        }
                        id = request.params.id;
                        return [4 /*yield*/, (0, knex_1["default"])('dishes')
                                .where({ id: id })
                                .first()];
                    case 1:
                        isValidDish = _d.sent();
                        if (!isValidDish) {
                            throw new AppError_1["default"]('Prato não encontrado! Não foi possível atualizar os dados.', 401);
                        }
                        category = request.query.category;
                        isValidCategory = { id: undefined, category: undefined };
                        if (!category) return [3 /*break*/, 3];
                        return [4 /*yield*/, (0, knex_1["default"])('categories')
                                .where({ category: category })
                                .first()];
                    case 2:
                        isValidCategory = (_d.sent());
                        if (!isValidCategory) {
                            throw new AppError_1["default"]('Categoria inválida! Processo abortado.', 401);
                        }
                        _d.label = 3;
                    case 3:
                        image = (_a = request.file) === null || _a === void 0 ? void 0 : _a.filename;
                        _b = request.query, dish = _b.dish, ingredients = _b.ingredients, cost = _b.cost, description = _b.description;
                        ingredientsItems = !ingredients
                            ? undefined
                            : ingredients.split(',');
                        helpers = new Helpers_1["default"]();
                        if (ingredientsItems && !helpers.checkArrayOfStrings(ingredientsItems)) {
                            throw new AppError_1["default"]('Algum ingrediente inválido encontrado! Abortando processo.', 401);
                        }
                        reais = undefined, cents = undefined;
                        if (cost) {
                            _c = cost.split('.'), reais = _c[0], cents = _c[1];
                        }
                        // So we can update data from the dish on focus:
                        return [4 /*yield*/, (0, knex_1["default"])('dishes')
                                .where({ id: id })
                                .update({
                                category_id: isValidCategory.id,
                                dish: dish,
                                description: description,
                                image: image,
                                reais: reais,
                                cents: cents.padEnd(2, '0'),
                                updated_at: knex_1["default"].fn.now()
                            })];
                    case 4:
                        // So we can update data from the dish on focus:
                        _d.sent();
                        if (!ingredientsItems) return [3 /*break*/, 11];
                        return [4 /*yield*/, (0, knex_1["default"])('ingredients')
                                .where({ dish_id: id })
                                .then(function (items) { return items.filter(function (item) { return !ingredientsItems.includes(item.ingredient); }).map(function (item) { return item.id; }); })];
                    case 5:
                        ingredientsToBeDeletedIds = _d.sent();
                        return [4 /*yield*/, (0, knex_1["default"])('ingredients')
                                .whereIn('id', ingredientsToBeDeletedIds)["delete"]()];
                    case 6:
                        _d.sent();
                        return [4 /*yield*/, (0, knex_1["default"])('ingredients')
                                .where({ dish_id: id })
                                .then(function (items) { return items.filter(function (item) { return ingredientsItems.includes(item.ingredient); }).map(function (item) { return item.ingredient; }); })];
                    case 7:
                        ingredientsToBeSkipped = _d.sent();
                        _i = 0, ingredientsItems_2 = ingredientsItems;
                        _d.label = 8;
                    case 8:
                        if (!(_i < ingredientsItems_2.length)) return [3 /*break*/, 11];
                        ingredient = ingredientsItems_2[_i];
                        if (!!ingredientsToBeSkipped.includes(ingredient)) return [3 /*break*/, 10];
                        return [4 /*yield*/, (0, knex_1["default"])('ingredients')
                                .insert({
                                dish_id: id,
                                ingredient: ingredient
                            })];
                    case 9:
                        _d.sent();
                        _d.label = 10;
                    case 10:
                        _i++;
                        return [3 /*break*/, 8];
                    case 11:
                        if (!image) return [3 /*break*/, 14];
                        diskStorage = new DiskStorage_1["default"]();
                        return [4 /*yield*/, diskStorage.saveFile(image)];
                    case 12:
                        _d.sent();
                        // And delete the previous image from the server
                        return [4 /*yield*/, diskStorage.deleteFile(isValidDish.image)];
                    case 13:
                        // And delete the previous image from the server
                        _d.sent();
                        _d.label = 14;
                    case 14: return [2 /*return*/, response.json()];
                }
            });
        });
    };
    DishesController.prototype.index = function (request, response) {
        return __awaiter(this, void 0, void 0, function () {
            var text, dishes, dishesIds;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        /* Method for indexing dishes and/or ingredients.
                        
                        The client can index entries by text string, and this method returns an array of dishes entries, which matches the expected text string by dish name or by ingredient. It tries to match by dish name, and if none found, then it tries to match by ingredient. If no ingredient is provided, then it fetches everything. Route to be accessed on real time when a client user is typing on a frontend input to search for dish entries.
                       
                        User must be authenticated to do so, for safety reasons.*/
                        // Ensure user authentication
                        if (!request.user) {
                            throw new AppError_1["default"]('Usuário(a) deve estar autenticado(a) para indexar pratos!', 401);
                        }
                        text = request.query.text;
                        if (!text) return [3 /*break*/, 5];
                        return [4 /*yield*/, (0, knex_1["default"])('dishes')
                                .whereLike('dish', "%".concat(text, "%"))];
                    case 1:
                        // Search for dishes that matches the given text string
                        dishes = (_a.sent());
                        if (!(dishes.length === 0)) return [3 /*break*/, 4];
                        return [4 /*yield*/, (0, knex_1["default"])('ingredients')
                                .whereLike('ingredient', "%".concat(text, "%"))
                                .then(function (ingredients) { return ingredients.map(function (ingredient) { return ingredient === null || ingredient === void 0 ? void 0 : ingredient.dish_id; }); })];
                    case 2:
                        dishesIds = _a.sent();
                        if (!(dishesIds.length > 0)) return [3 /*break*/, 4];
                        return [4 /*yield*/, (0, knex_1["default"])('dishes')
                                .whereIn('id', [dishesIds])];
                    case 3:
                        dishes = (_a.sent());
                        _a.label = 4;
                    case 4: return [3 /*break*/, 7];
                    case 5: return [4 /*yield*/, (0, knex_1["default"])('dishes')];
                    case 6:
                        dishes = (_a.sent());
                        _a.label = 7;
                    case 7: return [2 /*return*/, response.json(dishes)];
                }
            });
        });
    };
    DishesController.prototype.show = function (request, response) {
        return __awaiter(this, void 0, void 0, function () {
            var id, dish;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        /* Method for displaying data from dish of a given id.
                        
                        User must be authenticated for safety reasons.*/
                        // Ensure user authentication
                        if (!request.user) {
                            throw new AppError_1["default"]('Usuário(a) deve estar autenticado(a) para exibir dados de algum prato!', 401);
                        }
                        id = request.params.id;
                        return [4 /*yield*/, (0, knex_1["default"])('dishes')
                                .where({ id: id })
                                .first()];
                    case 1:
                        dish = _a.sent();
                        return [2 /*return*/, response.json(dish)];
                }
            });
        });
    };
    DishesController.prototype["delete"] = function (request, response) {
        return __awaiter(this, void 0, void 0, function () {
            var userIsAdmin, id, image, diskStorage;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        /* Method for deleting dish entry of a given id from the 'dishes' table.
                        
                        User must be an authenticated admin for safety reasons.
                        
                        After dish is deleted, its image is also removed from the server.*/
                        // Ensure user authentication
                        if (!request.user) {
                            throw new AppError_1["default"]('Usuário(a) deve estar autenticado(a) para deletar algum prato!', 401);
                        }
                        return [4 /*yield*/, (0, knex_1["default"])('users')
                                .where({ id: request.user.id })
                                .first()
                                .then(function (user) { return user.admin; })];
                    case 1:
                        userIsAdmin = _a.sent();
                        if (!userIsAdmin) {
                            throw new AppError_1["default"]('Usuário(a) precisa ter privilégios de administrador para deletar algum prato!', 401);
                        }
                        id = request.params.id;
                        return [4 /*yield*/, (0, knex_1["default"])('dishes')
                                .where({ id: id })
                                .first()
                                .then(function (dish) { return dish.image; })];
                    case 2:
                        image = _a.sent();
                        // Delete dish entry
                        return [4 /*yield*/, (0, knex_1["default"])('dishes')
                                .where({ id: id })["delete"]()];
                    case 3:
                        // Delete dish entry
                        _a.sent();
                        if (!image) return [3 /*break*/, 5];
                        diskStorage = new DiskStorage_1["default"]();
                        return [4 /*yield*/, diskStorage.deleteFile(image)];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5: return [2 /*return*/, response.json()];
                }
            });
        });
    };
    return DishesController;
}());
exports["default"] = DishesController;

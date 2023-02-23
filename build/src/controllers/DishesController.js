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
// Custom utils and providers
const AppError_1 = __importDefault(require("../utils/AppError"));
const Helpers_1 = __importDefault(require("../utils/Helpers"));
const DiskStorage_1 = __importDefault(require("../providers/DiskStorage"));
class DishesController {
    create(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            /* Method for creating a new dish, i.e, inserting data into table 'dishes'. Data inserted into this table are category_id, dish (its name), description, image path, and the dish's cost.
            
            The client provides category string, which must be validated in order to return the corresponding category_id. The cost is received as a float by the client, but stored in two distinct numeric fields, reais and cents, to avoid imprecision.
            
            Besides, each dish has many ingredients, with its corresponding data coming as an array of strings. Each item is inserted into the 'ingredients' table, referencing the newly created dish by its id.
            
            User must be an authenticated admin, for security, which means request.user exists and this user's entry exists in the 'users' table as well.
            
            A middleware exists to ensure that, before this method is called, the image sent by the client has been uploaded into the tmp folder. So, this method also transfers this image into the uploads folder, if everything is O.K. */
            // Ensure user authentication
            if (!request.user) {
                throw new AppError_1.default('Usuário(a) deve estar autenticado(a) para cadastrar pratos!', 401);
            }
            // Check if user is admin
            const userIsAdmin = yield (0, knex_1.default)('users')
                .where({ id: request.user.id })
                .first()
                .then(user => user.admin);
            if (!userIsAdmin) {
                throw new AppError_1.default('Usuário(a) precisa ter privilégios de administrador para cadastrar um novo prato!', 401);
            }
            // Get category from query params
            const { category } = request.query;
            // Check if category string is not null/undefined
            if (!category) {
                throw new AppError_1.default('Nenhuma categoria foi enviada para o servidor. Processo abortado!', 401);
            }
            // Check if category entry exists
            const isValidCategory = yield (0, knex_1.default)('categories')
                .where({ category })
                .first();
            if (!isValidCategory) {
                throw new AppError_1.default('Categoria inválida! Processo abortado.', 401);
            }
            // Now we can retrieve the image sent by the client. It must be on the tmp folder if middleware succeeded and must be moved to the uploads folder, where it will be available for the client.
            if (!request.file) {
                throw new AppError_1.default('Nenhuma imagem enviada pelo cliente! Processo abortado!', 401);
            }
            const image = request.file.filename;
            // Now we can get everything else from the query params as well
            const { dish, ingredients, cost, description } = request.query;
            // Ensure that all fields above aren't blank
            if (!dish || !ingredients || !cost || !description) {
                throw new AppError_1.default('Algum campo fora encontrado vazio. Processo abortado!', 401);
            }
            // Ensure ingredients contain an array of strings
            const ingredientsItems = ingredients.split(',');
            const helpers = new Helpers_1.default();
            if (!helpers.checkArrayOfStrings(ingredientsItems)) {
                throw new AppError_1.default('Algum ingrediente inválido encontrado! Abortando processo.', 401);
            }
            // We assume cost is a float number with dot as decimal point
            const [reais, cents] = cost.split('.');
            // So we can insert data as a new entry of dish:
            const dish_id = yield (0, knex_1.default)('dishes')
                .insert({
                category_id: isValidCategory.id,
                dish,
                description,
                image,
                reais,
                cents: cents.padEnd(2, '0')
            });
            // And also insert each ingredient as a new entry in the 'ingredients' table:
            for (let ingredient of ingredientsItems) {
                yield (0, knex_1.default)('ingredients')
                    .insert({
                    dish_id,
                    ingredient
                });
            }
            // Since everything went well, we can safely transfer the uploaded image to the uploads folder, where it is supposed to be accessible via another route
            const diskStorage = new DiskStorage_1.default();
            yield diskStorage.saveFile(image);
            return response.json();
        });
    }
    update(request, response) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            /* Method for updating an existing dish, i.e, overriding entry from table 'dishes'. The client provides the dish_id of the dish of interest, as well as the new data to override existing information.
            
            Data updated may be category_id, dish (its name), description, image path, and the dish's cost.
            
            If the client provides a category string, it must be validated in order to return the corresponding category_id.
            
            If the client provides ingredients, then all existing ingredients that are not present in the new ingredients array must be wiped away, while only ingredients that are new must be inserted into the appropriate table.
        
            User must be authenticated, for security, which means request.user exists.
            
            A middleware exists to ensure that, before this method is called, the image sent by the client has been uploaded into the tmp folder. So, this method also transfers this image into the uploads folder, if everything is O.K. Hence, the old image must be deleted from the server before moving the new one into the server. */
            // Ensure user authentication
            if (!request.user) {
                throw new AppError_1.default('Usuário(a) deve estar autenticado(a) para cadastrar pratos!', 401);
            }
            // Retrieve dish id from route params
            const { id } = request.params;
            // Check if dish exists
            const isValidDish = yield (0, knex_1.default)('dishes')
                .where({ id })
                .first();
            if (!isValidDish) {
                throw new AppError_1.default('Prato não encontrado! Não foi possível atualizar os dados.', 401);
            }
            // Get category from query params
            const { category } = request.query;
            let isValidCategory = { id: undefined, category: undefined };
            // If category was provided, check if corresponding entry exists. Otherwise, keep isValidCategory as undefined, so that it doesn't override existing category data when updating dish entry
            if (category) {
                isValidCategory = (yield (0, knex_1.default)('categories')
                    .where({ category })
                    .first());
                if (!isValidCategory) {
                    throw new AppError_1.default('Categoria inválida! Processo abortado.', 401);
                }
            }
            // Now we can retrieve the image sent by the client, if provided. It must be on the tmp folder if middleware succeeded and will be transferred to the uploads folder, where it will be available for the client.
            const image = (_a = request.file) === null || _a === void 0 ? void 0 : _a.filename;
            // Now we can get everything else from the query params as well
            const { dish, ingredients, cost, description } = request.query;
            // Ensure ingredients contain an array of strings, if one is provided
            // Ensure ingredients contain an array of strings
            const ingredientsItems = !ingredients
                ? undefined
                : ingredients.split(',');
            const helpers = new Helpers_1.default();
            if (ingredientsItems && !helpers.checkArrayOfStrings(ingredientsItems)) {
                throw new AppError_1.default('Algum ingrediente inválido encontrado! Abortando processo.', 401);
            }
            // We assume cost is a float number with dot as decimal point, if provided
            let reais = undefined, cents = undefined;
            if (cost) {
                [reais, cents] = cost.split('.');
            }
            // So we can update data from the dish on focus:
            yield (0, knex_1.default)('dishes')
                .where({ id })
                .update({
                category_id: isValidCategory.id,
                dish,
                description,
                image,
                reais,
                cents: cents.padEnd(2, '0'),
                updated_at: knex_1.default.fn.now()
            });
            // And also update this dish's ingredients:
            if (ingredientsItems) {
                // Check if there are ingredients to be deleted, i.e. those that are not present in the new ingredients array:
                let ingredientsToBeDeletedIds = yield (0, knex_1.default)('ingredients')
                    .where({ dish_id: id })
                    .then(items => items.filter(item => !ingredientsItems.includes(item.ingredient)).map(item => item.id));
                yield (0, knex_1.default)('ingredients')
                    .whereIn('id', ingredientsToBeDeletedIds)
                    .delete();
                // Besides, insert the new ingredients, i.e. those that are not currently present in the 'ingredients' table. To do so, first index the ingredients to be skipped, i.e. those that are the existing ingredients:
                let ingredientsToBeSkipped = yield (0, knex_1.default)('ingredients')
                    .where({ dish_id: id })
                    .then(items => items.filter(item => ingredientsItems.includes(item.ingredient)).map(item => item.ingredient));
                for (let ingredient of ingredientsItems) {
                    if (!ingredientsToBeSkipped.includes(ingredient)) {
                        yield (0, knex_1.default)('ingredients')
                            .insert({
                            dish_id: id,
                            ingredient
                        });
                    }
                }
            }
            // Since everything went well, we can safely transfer the uploaded image, if any, to the uploads folder, where it is supposed to be accessible via another route
            if (image) {
                const diskStorage = new DiskStorage_1.default();
                yield diskStorage.saveFile(image);
                // And delete the previous image from the server
                yield diskStorage.deleteFile(isValidDish.image);
            }
            return response.json();
        });
    }
    index(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            /* Method for indexing dishes and/or ingredients.
            
            The client can index entries by text string, and this method returns an array of dishes entries, which matches the expected text string by dish name or by ingredient. It tries to match by dish name, and if none found, then it tries to match by ingredient. If no ingredient is provided, then it fetches everything. Route to be accessed on real time when a client user is typing on a frontend input to search for dish entries.
           
            User must be authenticated to do so, for safety reasons.*/
            // Ensure user authentication
            if (!request.user) {
                throw new AppError_1.default('Usuário(a) deve estar autenticado(a) para indexar pratos!', 401);
            }
            // Retrieve text string from the body of the request
            const { text } = request.query;
            let dishes;
            // If text is defined, then try indexing dishes by text string
            if (text) {
                // Search for dishes that matches the given text string
                dishes = (yield (0, knex_1.default)('dishes')
                    .whereLike('dish', `%${text}%`));
                // If none is found, look out for ingredients that match the given string,
                // then return all dishes ids that matches the given ingredient, if any
                if (dishes.length === 0) {
                    const dishesIds = yield (0, knex_1.default)('ingredients')
                        .whereLike('ingredient', `%${text}%`)
                        .then(ingredients => ingredients.map(ingredient => ingredient === null || ingredient === void 0 ? void 0 : ingredient.dish_id));
                    if (dishesIds.length > 0) {
                        dishes = (yield (0, knex_1.default)('dishes')
                            .whereIn('id', [dishesIds]));
                    }
                }
                // If text is undefined, then index everything
            }
            else {
                dishes = (yield (0, knex_1.default)('dishes'));
            }
            return response.json(dishes);
        });
    }
    show(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            /* Method for displaying data from dish of a given id.
            
            User must be authenticated for safety reasons.*/
            // Ensure user authentication
            if (!request.user) {
                throw new AppError_1.default('Usuário(a) deve estar autenticado(a) para exibir dados de algum prato!', 401);
            }
            // Retrieve id from route params
            const { id } = request.params;
            const dish = yield (0, knex_1.default)('dishes')
                .where({ id })
                .first();
            return response.json(dish);
        });
    }
    delete(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            /* Method for deleting dish entry of a given id from the 'dishes' table.
            
            User must be an authenticated admin for safety reasons.
            
            After dish is deleted, its image is also removed from the server.*/
            // Ensure user authentication
            if (!request.user) {
                throw new AppError_1.default('Usuário(a) deve estar autenticado(a) para deletar algum prato!', 401);
            }
            // Check if user is admin
            const userIsAdmin = yield (0, knex_1.default)('users')
                .where({ id: request.user.id })
                .first()
                .then(user => user.admin);
            if (!userIsAdmin) {
                throw new AppError_1.default('Usuário(a) precisa ter privilégios de administrador para deletar algum prato!', 401);
            }
            // Retrieve id from route params
            const { id } = request.params;
            // Retrieve image name from dish entry to be deleted
            const image = yield (0, knex_1.default)('dishes')
                .where({ id })
                .first()
                .then(dish => dish.image);
            // Delete dish entry
            yield (0, knex_1.default)('dishes')
                .where({ id })
                .delete();
            // Since everything went well, we can safely delete the uploaded image
            if (image) {
                const diskStorage = new DiskStorage_1.default();
                yield diskStorage.deleteFile(image);
            }
            return response.json();
        });
    }
}
exports.default = DishesController;

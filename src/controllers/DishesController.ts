// Core dependencies
import knex from '../database/knex';

// Custom utils and providers
import AppError from '../utils/AppError';
import Helpers from '../utils/Helpers';
import DiskStorage from '../providers/DiskStorage';

// Type imports
import { CategoryProps } from './CategoriesController';

interface DishProps {
  id: number;
  category_id: number;
  dish: string;
  description: string;
  image: string;
  reais: number;
  cents: number;
  created_at: string;
  updated_at: string;
}

class DishesController {

  async create(request: any, response: any) {
    /* Method for creating a new dish, i.e, inserting data into table 'dishes'. Data inserted into this table are category_id, dish (its name), description, image path, and the dish's cost.
    
    The client provides category string, which must be validated in order to return the corresponding category_id. The cost is received as a float by the client, but stored in two distinct numeric fields, reais and cents, to avoid imprecision.
    
    Besides, each dish has many ingredients, with its corresponding data coming as an array of strings. Each item is inserted into the 'ingredients' table, referencing the newly created dish by its id.
    
    User must be an authenticated admin, for security, which means request.user exists and this user's entry exists in the 'users' table as well. 
    
    A middleware exists to ensure that, before this method is called, the image sent by the client has been uploaded into the tmp folder. So, this method also transfers this image into the uploads folder, if everything is O.K. */

    // Ensure user authentication
    if (!request.user) {
      throw new AppError('Usuário(a) deve estar autenticado(a) para cadastrar pratos!', 401);
    }

    // Check if user is admin
    const userIsAdmin = await knex('users')
      .where({ id: request.user.id })
      .first()
      .then(user => user.admin) as boolean;

    if (!userIsAdmin) {
      throw new AppError('Usuário(a) precisa ter privilégios de administrador para cadastrar um novo prato!', 401);
    }

    // Get category from query params
    const {
      category
    } = request.query;

    // Check if category string is not null/undefined
    if (!category) {
      throw new AppError('Nenhuma categoria foi enviada para o servidor. Processo abortado!', 401);
    }

    // Check if category entry exists
    const isValidCategory = await knex('categories')
      .where({ category })
      .first();

    if (!isValidCategory) {
      throw new AppError('Categoria inválida! Processo abortado.', 401);
    }

    // Now we can retrieve the image sent by the client. It must be on the tmp folder if middleware succeeded and must be moved to the uploads folder, where it will be available for the client.
    if (!request.file) {
      throw new AppError('Nenhuma imagem enviada pelo cliente! Processo abortado!', 401);
    }

    const image = request.file.filename;
 
    // Now we can get everything else from the query params as well
    const {
      dish,
      ingredients,
      cost,
      description
    } = request.query;

    // Ensure that all fields above aren't blank
    if (
      !dish || !ingredients || !cost || ! description
    ) {
      throw new AppError('Algum campo fora encontrado vazio. Processo abortado!', 401);
    }

    // Ensure ingredients contain an array of strings
    const ingredientsItems = ingredients.split(',');

    const helpers = new Helpers();

    if (!helpers.checkArrayOfStrings(ingredientsItems)) {
      throw new AppError('Algum ingrediente inválido encontrado! Abortando processo.', 401);
    }

    // We assume cost is a float number with dot as decimal point
    const [reais, cents] = cost.split('.');

    // So we can insert data as a new entry of dish:
    const dish_id = await knex('dishes')
      .insert({
        category_id: isValidCategory.id,
        dish,
        description,
        image,
        reais,
        cents
    });

    // And also insert each ingredient as a new entry in the 'ingredients' table:
    for (let ingredient of ingredientsItems) {
      await knex('ingredients')
        .insert({
          dish_id,
          ingredient
      });
    }

    // Since everything went well, we can safely transfer the uploaded image to the uploads folder, where it is supposed to be accessible via another route
    const diskStorage = new DiskStorage();

    await diskStorage.saveFile(image);
    
    return response.json();
  }

  async update(request: any, response: any) {
    /* Method for updating an existing dish, i.e, overriding entry from table 'dishes'. The client provides the dish_id of the dish of interest, as well as the new data to override existing information.
    
    Data updated may be category_id, dish (its name), description, image path, and the dish's cost.
    
    If the client provides a category string, it must be validated in order to return the corresponding category_id.
    
    If the client provides ingredients, then all existing ingredients that are not present in the new ingredients array must be wiped away, while only ingredients that are new must be inserted into the appropriate table.

    User must be authenticated, for security, which means request.user exists. 
    
    A middleware exists to ensure that, before this method is called, the image sent by the client has been uploaded into the tmp folder. So, this method also transfers this image into the uploads folder, if everything is O.K. Hence, the old image must be deleted from the server before moving the new one into the server. */

    // Ensure user authentication
    if (!request.user) {
      throw new AppError('Usuário(a) deve estar autenticado(a) para cadastrar pratos!', 401);
    }

    // Retrieve dish id from route params
    const { id } = request.params;
    
    // Check if dish exists
    const isValidDish: DishProps | undefined = await knex('dishes')
      .where({ id })
      .first();

    if (!isValidDish) {
      throw new AppError('Prato não encontrado! Não foi possível atualizar os dados.', 401);
    }
    
    // Get category from query params
    const {
      category
    } = request.query;

    let isValidCategory: CategoryProps = {id: undefined, category: undefined};
    // If category was provided, check if corresponding entry exists. Otherwise, keep isValidCategory as undefined, so that it doesn't override existing category data when updating dish entry
    if (category) {
      isValidCategory = await knex('categories')
        .where({ category })
        .first() as CategoryProps;

      if (!isValidCategory) {
        throw new AppError('Categoria inválida! Processo abortado.', 401);
      }
    }

    // Now we can retrieve the image sent by the client, if provided. It must be on the tmp folder if middleware succeeded and will be transferred to the uploads folder, where it will be available for the client.
    const image: string = request.file?.filename;

    // Now we can get everything else from the query params as well
    const {
      dish,
      ingredients,
      cost,
      description
    } = request.query;

    // Ensure ingredients contain an array of strings, if one is provided
    // Ensure ingredients contain an array of strings
    const ingredientsItems = !ingredients
      ? undefined
      : ingredients.split(',');

    const helpers = new Helpers();

    if (ingredientsItems && !helpers.checkArrayOfStrings(ingredientsItems)) {
      throw new AppError('Algum ingrediente inválido encontrado! Abortando processo.', 401);
    }

    // We assume cost is a float number with dot as decimal point, if provided
    let reais = undefined, cents = undefined
    if (cost) {
      [reais, cents] = cost.split('.');
    }

    // So we can update data from the dish on focus:
    await knex('dishes')
      .where({ id })  
      .update({
        category_id: isValidCategory.id,
        dish,
        description,
        image,
        reais,
        cents,
        updated_at: knex.fn.now()
    });

    // And also update this dish's ingredients:
    if (ingredientsItems) {

      // Check if there are ingredients to be deleted, i.e. those that are not present in the new ingredients array:
      let ingredientsToBeDeletedIds = await knex('ingredients')
        .where({ dish_id: id })
        .then(items => items.filter(item => !ingredientsItems.includes(item.ingredient)).map(item => item.id)) as number[];

      await knex('ingredients')
        .whereIn('id', ingredientsToBeDeletedIds)
        .delete();

      // Besides, insert the new ingredients, i.e. those that are not currently present in the 'ingredients' table. To do so, first index the ingredients to be skipped, i.e. those that are the existing ingredients:
      let ingredientsToBeSkipped = await knex('ingredients')
        .where({ dish_id : id })
        .then(items => items.filter(item => ingredientsItems.includes(item.ingredient)).map(item => item.ingredient)) as string[];

      for (let ingredient of ingredientsItems) {
        if (!ingredientsToBeSkipped.includes(ingredient)) {
          await knex('ingredients')
            .insert({
              dish_id: id,
              ingredient
            });
        }
      }
    }

    // Since everything went well, we can safely transfer the uploaded image, if any, to the uploads folder, where it is supposed to be accessible via another route
    if (image) {
      const diskStorage = new DiskStorage();
  
      await diskStorage.saveFile(image);
  
      // And delete the previous image from the server
      await diskStorage.deleteFile(isValidDish.image);
    }
    
    return response.json();
  }

  async index(request: any, response: any) {
    /* Method for indexing dishes and/or ingredients.
    
    The client can index entries by text string, and this method returns an array of dishes entries, which matches the expected text string by dish name or by ingredient. It tries to match by dish name, and if none found, then it tries to match by ingredient. If no ingredient is provided, then it fetches everything. Route to be accessed on real time when a client user is typing on a frontend input to search for dish entries.
   
    User must be authenticated to do so, for safety reasons.*/

    // Ensure user authentication
    if (!request.user) {
      throw new AppError('Usuário(a) deve estar autenticado(a) para indexar pratos!', 401);
    }

    // Retrieve text string from the body of the request
    const { text } = request.body;

    let dishes;
    // If text is defined, then try indexing dishes by text string
    if (text) {

      // Search for dishes that matches the given text string
      dishes = await knex('dishes')
        .whereLike('dish', `%${text}%`) as DishProps[];
  
      // If none is found, look out for ingredients that match the given string,
      // then return all dishes ids that matches the given ingredient, if any
      if (dishes.length === 0) {
        const dishesIds = await knex('ingredients')
          .whereLike('ingredient', `%${text}%`)
          .then(ingredients => ingredients.map(
            ingredient => ingredient?.dish_id
          )) as number[];
        
        if (dishesIds.length > 0) {
          dishes = await knex('dishes')
            .whereIn('id', [dishesIds]) as DishProps[];
        }
      }

    // If text is undefined, then index everything
    } else {

      dishes = await knex('dishes') as DishProps[];
    }

    return response.json(dishes);  
  }

  async show(request: any, response: any) {
    /* Method for displaying data from dish of a given id.
    
    User must be authenticated for safety reasons.*/
   
    // Ensure user authentication
    if (!request.user) {
      throw new AppError('Usuário(a) deve estar autenticado(a) para exibir dados de algum prato!', 401);
    }

    // Retrieve id from route params
    const { id } = request.params;

    const dish = await knex('dishes')
      .where({ id })
      .first() as DishProps;

    return response.json(dish);

  }

  async delete(request: any, response: any) {
    /* Method for deleting dish entry of a given id from the 'dishes' table.
    
    User must be an authenticated admin for safety reasons.
    
    After dish is deleted, its image is also removed from the server.*/
   
    // Ensure user authentication
    if (!request.user) {
      throw new AppError('Usuário(a) deve estar autenticado(a) para deletar algum prato!', 401);
    }

    // Check if user is admin
    const userIsAdmin = await knex('users')
      .where({ id: request.user.id })
      .first()
      .then(user => user.admin) as boolean;

    if (!userIsAdmin) {
      throw new AppError('Usuário(a) precisa ter privilégios de administrador para deletar algum prato!', 401);
    }

    // Retrieve id from route params
    const { id } = request.params;

    // Retrieve image name from dish entry to be deleted
    const image = await knex('dishes')
      .where({ id })
      .first()
      .then(dish => dish.image) as string;

    // Delete dish entry
    await knex('dishes')
      .where({ id })
      .delete();

    // Since everything went well, we can safely delete the uploaded image
    if (image) {
      const diskStorage = new DiskStorage();
  
      await diskStorage.deleteFile(image);
  
    }

    return response.json();

  }
}

export default DishesController;
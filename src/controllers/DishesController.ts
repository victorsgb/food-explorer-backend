// Core dependencies
import knex from '../database/knex';

// Custom utils and providers
import AppError from '../utils/AppError';
import Helpers from '../utils/Helpers';
import DiskStorage from '../providers/DiskStorage';

class DishesController {

  async create(request: any, response: any) {
    /* Method for creating a new dish, i.e, inserting data into table 'dishes'. Data inserted into this table are category_id, dish (its name), description, image path, and the dish's cost.
    
    The client provides category string, which must be validated in order to return the corresponding category_id. The cost is received as a float by the client, but stored in two distinct numeric fields, reais and cents, to avoid imprecision.
    
    Besides, each dish has many ingredients, with its corresponding data coming as an array of strings. Each item is inserted into the 'ingredients' table, referencing the newly created dish by its id.
    
    User must be authenticated, for security, which means request.user exists. 
    
    A middleware exists to ensure that, before this method is called, the image sent by the client has been uploaded into the tmp folder. So, this method also transfers this image into the uploads folder, if everything is O.K. */

    // Ensure user authentication
    if (!request.user) {
      throw new AppError('Usuário(a) deve estar autenticado(a) para cadastrar pratos!', 401);
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
    const ingredients_pars = JSON.parse(ingredients);

    const helpers = new Helpers();

    if (!helpers.checkArrayOfStrings(ingredients_pars)) {
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
    for (let ingredient of ingredients_pars) {
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
    
    If the client provides ingredients, then all existing ingredients must be wiped away, so that the new ingredients are inserted into the appropriate table.

    User must be authenticated, for security, which means request.user exists. 
    
    A middleware exists to ensure that, before this method is called, the image sent by the client has been uploaded into the tmp folder. So, this method also transfers this image into the uploads folder, if everything is O.K. Hence, the old image must be deleted from the server before moving the new one into the server. */

    // Ensure user authentication
    if (!request.user) {
      throw new AppError('Usuário(a) deve estar autenticado(a) para cadastrar pratos!', 401);
    }

    // Retrieve dish id from route params
    const { id } = request.params;
    
    // Check if dish exists
    const isValidDish = await knex('dishes')
      .where({ id })
      .first();

    if (!isValidDish) {
      throw new AppError('Prato não encontrado! Não foi possível atualizar os dados.', 401);
    }
    
    // Get category from query params
    const {
      category
    } = request.query;

    let isValidCategory = {id: undefined};
    // If category was provided, check if corresponding entry exists. Otherwise, keep isValidCategory as it is, so that it doesn't override existing category data when updating dish entry
    if (category) {
      isValidCategory = await knex('categories')
        .where({ category })
        .first();

      if (!isValidCategory) {
        throw new AppError('Categoria inválida! Processo abortado.', 401);
      }
    }

    // Now we can retrieve the image sent by the client, if provided. It must be on the tmp folder if middleware succeeded and will be transferred to the uploads folder, where it will be available for the client.
    const image = request.file?.filename;

    // Now we can get everything else from the query params as well
    const {
      dish,
      ingredients,
      cost,
      description
    } = request.query;

    // Ensure ingredients contain an array of strings, if one is provided
    const ingredients_pars = !ingredients
      ? undefined
      : JSON.parse(ingredients);

    const helpers = new Helpers();

    if (ingredients_pars && !helpers.checkArrayOfStrings(ingredients_pars)) {
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

    // And also wipe away this dish's existing ingredients, to insert the new ones, if there are the client provided ingredients:
    if (ingredients_pars) {
      await knex('ingredients')
        .where({ dish_id: id })
        .delete();
    }

    // Besides, also insert each ingredient as a new entry in the 'ingredients' table:
    if (ingredients_pars) {
      for (let ingredient of ingredients_pars) {
        await knex('ingredients')
          .insert({
            dish_id: id,
            ingredient
        });
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
}

export default DishesController;
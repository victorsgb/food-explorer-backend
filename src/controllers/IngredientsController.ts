// Core dependencies
import knex from '../database/knex';

// Custom utils
import AppError from '../utils/AppError';

class IngredientsController {

  async index(request: any, response: any) {
    /* Method for indexing all ingredients from a given dish. The client must provide a valid dish id via route params.

    User must be authenticated for safety reasons.*/

    // Ensure user authentication
    if (!request.user) {
      throw new AppError('Usuário(a) deve estar autenticado(a) para indexar pratos!', 401);
    }

    // Retrieve dish id from route params
    const { dish_id } = request.params

    const ingredients = await knex('ingredients')
      .where({ dish_id })
      .then(items => items.map(
        item => item.ingredient
      )) as string[];

    return response.json(ingredients);
    
  }
}

export default IngredientsController;
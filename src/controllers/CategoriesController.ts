// Core dependencies
import knex from '../database/knex';
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse';

// Custom utils
import AppError from '../utils/AppError';

export interface CategoryProps {
  id: number | undefined;
  category: string | undefined;
  created_at?: string;
  updated_at?: string;
}

class CategoriesController {
  async create_from_csv(request: any, response: any) {
    /* Method meant for inserting several entries into the 'categories' table at once. It expects a file called categories.csv, which must be a single column of data. First row, i.e, the title, is skipped from reading. */
    
    fs.createReadStream(
      path.resolve(__dirname, '..', 'database', 'files', 'categories.csv'))
    .pipe(parse({ delimiter: ',', from_line: 2 }))
    .on('data', row => {
      async function insertCategoryIntoDatabase(category: string) {

        // Ensure category entry exists
        if (!category) {
          return;
        }

        // Ensure category entry is unique
        const categoryIsAlreadyInDatabase = await knex('categories')
          .where({ category })
          .first();
        
        if (categoryIsAlreadyInDatabase) {
          return;
        }

        // Since entry is unique, we can safely insert it into the database:
        const response = await knex('categories')
          .insert({ category });
          
        console.log(`Entry ${response} inserted into 'categories' table. Category: ${category}`);
      }
      insertCategoryIntoDatabase(row);
    })
    .on('error', error => {
      throw new AppError(error.message);
    })
    .on('end', () => {
      console.log('finished');
    });

    return response.json();
  }

  async index(request: any, response: any) {
    /* Method for indexing all categories at once.
    
    User must be authenticated for safety reasons.*/

    // Ensure user authentication
    if (!request.user) {
      throw new AppError('Usuário(a) deve estar autenticado(a) para indexar pratos!', 401);
    }

    const categories = await knex('categories') as CategoryProps[];

    return response.json(categories);
    
  }
}

export default CategoriesController;
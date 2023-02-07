// Core dependencies
import knex from '../database/knex';
import { hash, compare } from 'bcryptjs';

//Custom utils
import AppError from '../utils/AppError';

const bcryptSalt = process.env.BCRYPT_SALT;

interface UserProps {
  admin: boolean;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
}

class UsersController {
  async create(request: any, response: any) {
    /* Method for creating a new user, i.e, inserting data into table 'users'. Data to be sent is name, email, and password, retrieved from request.body. Email must be unique but there is no password restriction on backend */

    // Get data from body of request
    const {
      name,
      email,
      password
    } = request.body;

    // Check if all fields exist
    if (!name || !email || !password) {
      throw new AppError('Nem todos os campos foram preenchidos! Processo abortado.', 401);
    }

    // Check if email is already in use since it must be unique
    const emailAlreadyInUse = await knex('users')
      .where({ email }).first();

    if (emailAlreadyInUse) {
      throw new AppError('E-mail inválido - já se encontra cadastrado por outro(a) usuário(a)!', 401);
    }

    const hashedPassword = await hash(password, Number(bcryptSalt));

    // Inserting new user into database - only non-admin users can be created following this route - we're assuming users are set as admin directly on the database.
    await knex('users').insert({
      admin: false,
      name,
      email,
      password: hashedPassword
    });

    return response.json();
  }

  async update(request: any, response: any) {
    /* Method for update of some data of a given user, assuming he/she is is authenticated. Data to be updated is name, email and/or password. Email must be unique and password is only updated if user provided its current password. */
    
    // Assuming user is authenticated means that request.user.id exists...
    const id = request.user?.id;

    if (!id) {
      throw new AppError('Usuário(a) não autenticado(a) corretamente!', 401);
    }

    const isValidUser = await knex('users')
      .where({ id })
      .first();

    if (!isValidUser) {
      throw new AppError('Usuário(a) não encontrado(a) no banco de dados!', 401);
    }

    // Since user is authenticated and found on the database, we can now retrieve its new data from the body of request. Not all fields must be filled; name can be undefined, for example.
    const {
      name,
      email,
      password
    } = request.body;

    // If email is provided, check if new email is not currently in use by another user
    if (email) {
      const isEmailInUse = await knex('users')
        .where({ email })
        .whereNot({ id })
        .first();
      
      if (isEmailInUse) {
        throw new AppError('E-mail inválido - já cadastrado no banco de dados por outro usuário(a)!', 401);
      }
    }

    // If password is provided, let's retrieve the old password from the body of the request, to ensure the user knows it for security measures
    let hashedPassword = undefined;
    if (password) {
      const {
        oldPassword
      } = request.body;

      if (!oldPassword) {
        throw new AppError('Não é possível atualizar a senha sem fornecer uma senha antiga. Processo de atualização de cadastro abortado.', 401);
      }

      const oldPasswordMatches = await compare(oldPassword, isValidUser.password);

      if (!oldPasswordMatches) {
        throw new AppError('Senha atual não confere! Processo de atualização de cadastro abortado.', 401);
      }

      // When the old password matches, we can now encrypt the new password and pass in on
      hashedPassword = await hash(password, Number(bcryptSalt));
    }

    // Finally update the user. We do not need to worry about empty fields, since undefined fields are ignored by knex.update({...})
    await knex('users')
      .where({ id })
      .update({
        name,
        email,
        password: hashedPassword,
        updated_at: knex.fn.now()
    });

    return response.json();
  }

  async show(request: any, response: any) {
    /* Method meant for exhibiting some data from user of a given id, sent via route params */
    const { id } = request.params;

    // Notice we're omitting user's password to be retrieved, for security measures 
    const validUser: UserProps = await knex('users')
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
      throw new AppError('Usuário(a) não encontrado(a)!', 401);
    }

    return response.json(validUser);

  }
}

export default UsersController;
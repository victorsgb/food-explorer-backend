// Core dependencies
import knex from '../database/knex';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';

// Custom utils and configs
import authConfig from '../configs/auth';
import AppError from '../utils/AppError';

class SessionsController {
  async create(request: any, response: any) {
    /* Method meant for creating a login session. It retrieves email and password from the body of the request and checks if these belong to any user on database. If a match is found, then data from this user is sent back to the requester, along with a token */

    const { email, password } = request.body;
    
    // Both email and password are mandatory
    if (!email || !password) {
      throw new AppError('E-mail e/ou senha não fornecido(s)! Processo abortado.', 401);
    }

    const validUser = await knex('users')
      .where({ email })
      .first();

    if (!validUser) {
      throw new AppError('E-mail e/ou senha incorretos! Tente novamente.', 401);
    }

    const passwordMatched = await compare(password, validUser.password);

    if (!passwordMatched) {
      throw new AppError('E-mail e/ou senha incorretos! Tente novamente.', 401);
    }

    const { secret, expiresIn } = authConfig.jwt;

    const token = sign({}, secret, {
      subject: String(validUser.id),
      expiresIn
    });

    return response.json({ validUser, token });
  }
}

export default SessionsController;
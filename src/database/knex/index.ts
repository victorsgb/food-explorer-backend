import config from '../../../knexfile';
import knex from 'knex';

const connection = knex(config.development);

export default connection;
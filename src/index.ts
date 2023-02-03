// Core dependencies
require('express-async-errors');
require('dotenv/config');
import cors from 'cors';
import express from 'express';
import routes from '../src/routes';
import AppError from '../src/utils/AppError';

const app = express();
app.use(cors());
app.use(express.json());

app.use(routes);

app.use((error: any, request : any, response: any, next: any) => {

  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      'status': 'error',
      'message': error.message
    });
  }

  return response.status(500).json({
    'status': 'error',
    'message': 'Erro interno no servidor'
  });
});

const PORT = process.env.PORT || 3336;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
})
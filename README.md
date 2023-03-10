# FoodExplorer Backend

API for serving a front-end web application of a fictitious restaurant. This document is first written in English and then in Portuguese.

<p align="center">
  <img src="https://img.shields.io/github/last-commit/victorsgb/food-explorer-backend?style=plastic"/>
  <img src="https://img.shields.io/github/repo-size/victorsgb/food-explorer-backend?color=red&style=plastic"/>
  <img src="https://img.shields.io/github/languages/count/victorsgb/food-explorer-backend?color=yellow&style=plastic">
  <img src="https://img.shields.io/github/languages/top/victorsgb/food-explorer-backend?style=plastic">
</p>

## English version

### Project description

This is the last training task in the [Rocketseat Explorer program](https://www.rocketseat.com.br/explorer), which is about creating an API using [Node.js](https://nodejs.org/en/) to serve a front-end web application of a fictional restaurant, whose construction is also part of this task and whose repository is also hosted [on GitHub](https://github.com/victorsgb/food-explorer-frontend).

The project consists of several REST endpoints to be accessed by the front-end application so that it can retrieve, store, and modify data in a relational database ([SQLite3](https://www.sqlite.org/index.html)) supported by the [Knex](https://knexjs.org/) query builder.

### Dependencies

This project contains the following dependencies:

- **[`bcryptjs`](https://www.npmjs.com/package/bcryptjs), [compatible with version](https://stackoverflow.com/questions/22343224/whats-the-difference-between-tilde-and-caret-in-package-json) *2.4.3***: used to encrypt passwords before registering them in the database;
- **[`cors`](https://www.npmjs.com/package/cors), compatible with version *2.8.5***: used to provide middleware that allows the front-end application to connect to this server;
- **[`csv-parse`](https://www.npmjs.com/package/csv-parse), compatible with version *5.3.4***: used to read csv files for iterative creation of category entries in the relational database;
- **[`express`](https://www.npmjs.com/package/express), compatible with version *4.18.2***: Web framework for Node.js;
- **[`express-async-errors`](https://www.npmjs.com/package/express-async-errors), compatible with version *3.1.1***: used to provide message passing errors from the server to the client in a customized way;
- **[`jsonwebtoken`](https://www.npmjs.com/package/jsonwebtoken), compatible with version *9.0.0***: used to create JWT tokens in JSON format;
- **[`knex`](https://knexjs.org/), compatible with version *2.4.2***: used for creating queries and communicating with relational database in SQLite3;
- **[`multer`](https://www.npmjs.com/package/multer), compatible with version *1.4.5-lts.1***: is a middleware that allows uploading images to the server;
- **[`pm2`](https://www.npmjs.com/package/pm2), compatible with version *5.2.2***: used for server management in production;
- **[`sqlite3`](https://www.npmjs.com/package/sqlite3), compatible with version *5.1.4***: used for creating SQLite3 relational database.

### Project deploy

This project was provided by [Render](https://render.com/) and you can access it at this [link](https://food-explorer-backend.onrender.com), although all you see is an HTTP request error. More interestingly, you make requests to the server (whether it's on the Internet or running on your local machine after you clone this project) via applications like [Insomnia](https://insomnia.rest/download ).

### Project structure

The `src` folder contains the `index.ts` file whose job is to start the server on the specified port.

the `configs` folder contains the upload settings as well as the settings for authentication via JWT tokens;

`utils` contains files with functions that may be accessed from many parts of the application to avoid code repetition;

`middlewares` contains the ensureAuthenticated hook, which is used to ensure that the client is authenticated before accessing certain routes;

`providers` contains a file that points to a class for saving and deleting files in the `tmp/uploads` folder, which is intended for storing dish images;

`routes` contains the application's routes, which have the task of instantiating and calling the appropriate controllers depending on the route accessed;

`controllers` contains the controllers used to interact with the database, depending on which route the client is accessing. The controllers created in this project are:
> `Users` - has three methods related to creating, updating and displaying user data;
> `Sessions` - has the function of creating a session for the client and verifying that it has credentials to access the non-public application routes;
> `Categories` - has two methods: one for automatically creating category entries listed in a given csv file, and another for indexing all existing categories;
> `Ingredients` - has only one method to index all ingredients of a given dish, using its ID as a search parameter;
> `Dishes` - has methods for creating, updating, indexing and deleting dishes, as well as displaying the information about a given dish using its ID as a parameter;

`database` contains two subfolders, in addition to the database file itself, in SQLite:
> `files` contains only a csv file for the automatic creation of all the categories that the client lists when accessing a particular route for this purpose;
> `knex` contains the migration files for indirect creation of database tables.

Below is the structure of the existing tables:
>> `users`, with the following fields: **id**, of type *number*, **admin**, of type *boolean*, **name**, of type *string*, **email**, of type *string*, **password**, of type *string*, **created_at**, of type *string*, and **updated_at**, of type *string*. **admin** users are allowed to create, view, edit and delete dishes. During registration, the new user is added as a non-admin - to change this status, you must change this directly in the database via brute-force (if you have your own clone of this project on your local machine, of course).
>> `categories`, with the following fields: **id**, of type *number*, **category**, of type *string*, **created_at**, of type *string* and **updated_at**, of type *string*.
>> `dishes`, with the following fields: **id**, of type *number*, **category_id**, of type *number*, which is a foreign key that references entries in the `categories` table, **dish**, of type *string*, **description**, of type *string*, **image**, of type *string*, **reals** and **cents**, of type *number*, **created_at**, of type *string* and **updated_at**, of type *string*.
>> `ingredients`, with the following fields: **id**, of type *number*, **dish_id**, of type *number*, which is a foreign key that references entries in the `dishes` table, **ingredient**, of type *string*, **created_at**, of type *string*, and **updated_at**, of type *string*.

### How to run this project locally

Assuming you have both `git` and `npm` installed on your machine, you must follow these simple steps. First, go to the directory you are interested in and clone this repository:

> `git clone https://github.com/victorsgb/food-explorer-backend`

Then change to the newly created folder containing your new local repository:

> `cd food-explorer-backend`

Install the project's dependencies (assuming you have the `npm` package installed on your machine):

> `npm install`

And that's it! You can now run the project in a developer environment. The server is started on port 3334 after you run the following command:

> `npm run dev`

If you want to run the project in a production environment, simply type the following:

> `npm run start`

The server is expected to be running normally on the specified port and ready to receive requests from the web client, namely the [FoodExplorer Frontend](https://github.com/victorsgb/food-explorer-frontend).

---

## Vers??o em portugu??s

### Descri????o do projeto

Este ?? a tarefa final do treinamento no [programa Explorer, da Rocketseat](https://www.rocketseat.com.br/explorer), que se trata da cria????o de uma API usando [Node.js](https://nodejs.org/en/) para servir uma aplica????o front-end web de um restaurante fict??cio, cuja constru????o tamb??m fez parte desta tarefa e cujo reposit??rio tamb??m se encontra hospedado [no GitHub](https://github.com/victorsgb/food-explorer-frontend).

O projeto consiste de v??rias *REST endpoints* para serem acessadas pela aplica????o web para que esta posa recuperar, armazenar ou modificar dados armazenados num banco de dados relacional ([SQLite3](https://www.sqlite.org/index.html)) criado com uso da Query Builder [Knex](https://knexjs.org/).

### Depend??ncias

Este projeto cont??m as seguintes depend??ncias:

- **[`bcryptjs`](https://www.npmjs.com/package/bcryptjs), [compat??vel com a vers??o](https://stackoverflow.com/questions/22343224/whats-the-difference-between-tilde-and-caret-in-package-json) *2.4.3***: usado para criptografia de senhas antes do registro no banco de dados;
- **[`cors`](https://www.npmjs.com/package/cors), compat??vel com a vers??o *2.8.5***: usado para prover um middleware que possibilita a conex??o da aplica????o front-end com este servidor;
- **[`csv-parse`](https://www.npmjs.com/package/csv-parse), compat??vel com a vers??o *5.3.4***: usado para leitura de arquivos csv, para cria????o iterativa de entradas de categorias no banco de dados relacional;
- **[`express`](https://www.npmjs.com/package/express), compat??vel com a vers??o *4.18.2***: framework web para o Node.js;
- **[`express-async-errors`](https://www.npmjs.com/package/express-async-errors), compat??vel com a vers??o *3.1.1***: usado prover o envio das mensagens de erro do servidor para o cliente de maneira customizada;
- **[`jsonwebtoken`](https://www.npmjs.com/package/jsonwebtoken), compat??vel com a vers??o *9.0.0***: usado para a cria????o de tokens JWT em formato JSON;
- **[`knex`](https://knexjs.org/), compat??vel com a vers??o *2.4.2***: usado para constru????o de queries e comunica????o com o banco de dados relacional em SQLite3;
- **[`multer`](https://www.npmjs.com/package/multer), compat??vel com a vers??o *1.4.5-lts.1***: que ?? um middleware usado para prover o upload de imagens no servidor;
- **[`pm2`](https://www.npmjs.com/package/pm2), compat??vel com a vers??o *5.2.2***: usado para gest??o do servidor em produ????o;
- **[`sqlite3`](https://www.npmjs.com/package/sqlite3), compat??vel com a vers??o *5.1.4***: usado para cria????o do banco de dados relacional SQLite3.

### Deploy do projeto

O deploy deste projeto foi realizado pela [Render](https://render.com/) e voc?? pode acess??-lo neste [link](https://food-explorer-backend.onrender.com), embora tudo o que veja seja um erro de requisi????o HTTP. ?? mais interessante que voc?? fa??a pedidos de requisi????o ao servidor (seja este rondando na web, ou rodando na sua m??quina local, ap??s clonar este projeto) por meio de aplica????es tal qual o [Insomnia](https://insomnia.rest/download).

### Estrutura do projeto

A pasta `src` cont??m o arquivo `index.ts`, cuja fun????o ?? inicializar o servidor na porta especificada.

`configs` cont??m as configura????es de autentica????o via Token JWT, al??m das configura????es de upload;

`utils` cont??m arquivos ??teis, com fun????es que ser??o potencialmente acessadas de v??rias da aplica????o, para evitar repeti????o de c??digo;

`middlewares` cont??m a hook ensureAuthenticated, que serve para garantir que o cliente esteja autenticado, antes que determinadas rotas sejam acessadas;

`providers` cont??m arquivo referenciando uma classe para armazenamento e exclus??o de arquivos na pasta `tmp/uploads`, destinada para armazenar as imagens dos pratos;

`routes` cont??m as rotas da aplica????o, que t??m o dever de instanciar e chamar os controladores adequados a depender da rota acessada;

`controllers` cont??m os controladores usados para interagir com o banco de dados, a depender da rota acessada pelo cliente. Os controladores criados neste projeto s??o:
> `Users` - tem tr??s m??todos, relacionados com a cria????o, atualiza????o e exibi????o de alguns dados de usu??rios, respectivamente;
> `Sessions` - tem a fun????o de criar uma sess??o para o cliente, verificando se tal tem credencial para acessar as rotas da aplica????o que n??o s??o p??blicas;
> `Categories` - tem dois m??todos: um para cria????o autom??tica das entradas de categorias listadas em determinado arquivo csv, e outro para indexar todas as categorias existentes;
> `Ingredients` - tem apenas um m??todo para indexar todos os ingredientes de um determinado prato, tomando o id deste como par??metro de busca;
> `Dishes` - tem m??todos para cria????o, atualiza????o, indexa????o, dele????o de pratos, bem como para visualiza????o das informa????es de determinado prato, tomando como par??metro o seu id;

`database` cont??m duas sub-pastas, al??m do arquivo do banco de dados em si, em SQLite:
> `files`, que cont??m apenas um arquivo csv para cria????o autom??tica de todas as categorias listadas pelo cliente, ao acessar determinada rota para este fim;
> `knex`, que cont??m os arquivos de migrations, para cria????o das tables do banco de dados de forma indireta.

Segue abaixo a estrutura das tables existentes:
>> `users`, com os seguintes campos: **id**, do tipo *number*, **admin**, do tipo *boolean*, **name**, do tipo *string*, **email**, do tipo *string*, **password**, do tipo *string*, **created_at**, do tipo *string* e **updated_at**, do tipo *string*. Usu??rios **admin** t??m permiss??o para criar, visualizar, editar e deletar pratos. Ao se cadastrar, o novo usu??rio ?? inserido como n??o admin - para mudar tal status, ?? necess??rio fazer a modifica????o via brute-force no banco de dados.
>> `categories`, com os seguintes campos: **id**, do tipo *number*, **category**, do tipo *string*, **created_at**, do tipo *string* e **updated_at**, do tipo *string*.
>> `dishes`, com os seguintes campos: **id**, do tipo *number*, **category_id**, do tipo *number*, que ?? uma chave estrangeira referenciando entradas na table `categories`, **dish**, do tipo *string*, **description**, do tipo *string*, **image**, do tipo *string*, **reais** e **cents**, do tipo *number*, **created_at**, do tipo *string* e **updated_at**, do tipo *string*.
>> `ingredients`, com os seguintes campos: **id**, do tipo *number*, **dish_id**, do tipo *number*, que ?? uma chave estrangeira referenciando entradas na table `dishes`, **ingredient**, do tipo *string*, **created_at**, do tipo *string* e **updated_at**, do tipo *string*.

### Como rodar este projeto localmente

Supondo que voc?? j?? tenha `git` e `npm` instalados na sua m??quina, voc?? deve seguir estes passos simples. Primeiro, v?? ao diret??rio de seu interesse e clone este reposit??rio:

> `git clone https://github.com/victorsgb/food-explorer-backend`

Ent??o, v?? para a pasta rec??m-criada contendo o seu novo reposit??rio local:

> `cd food-explorer-backend`

Instale as depend??ncias do projeto (assumindo que voc?? tenha o pacote `npm` instalado na sua m??quina):

> `npm install`

E pronto! Voc?? j?? pode rodar o projeto em ambiente de desenvolvedor. O servidor ser?? inicializado na porta 3334, ap??s voc?? rodar o seguinte comando:

> `npm run dev`

Caso queira rodar o projeto em ambiente de produ????o, basta digitar o comando a seguir:

> `npm run start`

E ?? isso! Espera-se que o servidor esteja rodando normalmente, na porta especificada, pronto para receber solicita????es do cliente web, a saber, o [FoodExplorer Frontend](https://github.com/victorsgb/food-explorer-frontend).

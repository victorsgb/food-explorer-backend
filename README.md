# FoodExplorer Backend

This document is written first in English and then in Portuguese.

## English version

### Deploy the project

This project was deployed with [Render](https://render.com/), and you can access it at this [link](https://food-explorer-backend.onrender.com), although everything that you see is an HTTP request error. It is more interesting that you make server requests running at `https://food-explorer-backend.onrender.com` through applications such as [Insomnia](https://insomnia.rest/download) or directly from your favorite browser.

### Project structure

The `src` folder contains the `index.ts` file, whose function is to start the server on the specified port.

`configs` contains the authentication settings via JWT Token, in addition to the upload settings;

`utils` contains files with functions that will potentially be accessed from many parts of the application to avoid code repetition;

`middlewares` contains the ensureAuthenticated hook, which serves to ensure that the client is authenticated before specific routes are accessed;

`providers` contains a file referencing a class for storing and deleting files in the `tmp/uploads` folder, intended for storing dish images;

`routes` contains the application's routes, which have the duty of instantiating and calling the appropriate controllers depending on the accessed route;

`controllers` contains the controllers used to interact with the database, depending on the route accessed by the client. The controllers created in this project are:
> `Users` - has three methods related to creating, updating, and displaying some user data respectively;
> `Sessions` - has the function of creating a session for the client, verifying if it has credentials to access the application routes that are not public;
> `Categories` - has two methods: one for automatically creating category entries listed in a given csv file and another for indexing all existing categories;
> `Ingredients` - has only one method to index all the ingredients of a given dish, taking its id as a search parameter;
> `Dishes` - has methods for creating, updating, indexing, and deleting dishes, as well as for viewing the information of a given dish taking its id as a parameter;

`database` contains two subfolders, in addition to the database file itself, in SQLite:
> `files` contains just one csv file for the automatic creation of all categories listed by the client when accessing a specific route for this purpose;
> `knex` contains the migrations files for creating database tables indirectly.

Below is the structure of the existing tables:
>> `users`, with the following fields: **id**, of type *number*, **admin**, of type *boolean*, **name**, of type *string*, **email**, of type *string*, **password**, of type *string*, **created_at**, of type *string*, and **updated_at**, of type *string*. **admin** users are allowed to create, view, edit and delete dishes. When registering, the new user is inserted as non-admin - to change this status, it is necessary to brute-force the database.
>> `categories`, with the following fields: **id**, of type *number*, **category**, of type *string*, **created_at**, of type *string* and **updated_at**, of type *string*.
>> `dishes`, with the following fields: **id**, of type *number*, **category_id**, of type *number*, which is a foreign key referencing entries in table `categories`, **dish**, of type *string*, **description**, of type *string*, **image**, of type *string*, **reals** and **cents**, of type *number*, **created_at**, of type *string* and **updated_at**, of type *string*.
>> `ingredients`, with the following fields: **id**, of type *number*, **dish_id**, of type *number*, which is a foreign key referencing entries in table `dishes`, **ingredient**, of type *string*, **created_at**, of type *string*, and **updated_at**, of type *string*.

### How to run this project locally

Assuming you have both `git` and `npm` installed on your machine, you must follow these simple steps. First, go to the directory you are interested in and clone this repository:

> `git clone https://github.com/victorsgb/food-explorer-backend`

Then, go to the newly created folder containing your new local repository:

> `cd food-explorer-backend`

Install the project's dependencies (assuming you have the `npm` package installed on your machine):

> `npm install`

And that's it! You can now run the project in a developer environment. The server will start on port 3334 after you run the following command:

> `npm run dev`

In case you want to run the project in a production environment, you simply type the following:

> `npm run start`

The server is expected to run normally on the specified port, ready to receive requests from the web client, namely the [FoodExplorer Frontend](https://github.com/victorsgb/food-explorer-frontend).

---

## Versão em português

### Deploy do projeto

O deploy deste projeto foi realizado com a [Render](https://render.com/) e você pode acessá-lo neste [link](https://food-explorer-backend.onrender.com), embora tudo o que veja seja um erro de requisição HTTP. É mais interessante que você faça pedidos de requisição ao servidor rodando em `https://food-explorer-backend.onrender.com` por meio de aplicações tal qual o [Insomnia](https://insomnia.rest/download), ou diretamente pelo seu navegador favorito.

### Estrutura do projeto

A pasta `src` contém o arquivo `index.ts`, cuja função é inicializar o servidor na porta especificada.

`configs` contém as configurações de autenticação via Token JWT, além das configurações de upload;

`utils` contém arquivos úteis, com funções que serão potencialmente acessadas de várias da aplicação, para evitar repetição de código;

`middlewares` contém a hook ensureAuthenticated, que serve para garantir que o cliente esteja autenticado, antes que determinadas rotas sejam acessadas;

`providers` contém arquivo referenciando uma classe para armazenamento e exclusão de arquivos na pasta `tmp/uploads`, destinada para armazenar as imagens dos pratos;

`routes` contém as rotas da aplicação, que têm o dever de instanciar e chamar os controladores adequados a depender da rota acessada;

`controllers` contém os controladores usados para interagir com o banco de dados, a depender da rota acessada pelo cliente. Os controladores criados neste projeto são:
> `Users` - tem três métodos, relacionados com a criação, atualização e exibição de alguns dados de usuários, respectivamente;
> `Sessions` - tem a função de criar uma sessão para o cliente, verificando se tal tem credencial para acessar as rotas da aplicação que não são públicas;
> `Categories` - tem dois métodos: um para criação automática das entradas de categorias listadas em determinado arquivo csv, e outro para indexar todas as categorias existentes;
> `Ingredients` - tem apenas um método para indexar todos os ingredientes de um determinado prato, tomando o id deste como parâmetro de busca;
> `Dishes` - tem métodos para criação, atualização, indexação, deleção de pratos, bem como para visualização das informações de determinado prato, tomando como parâmetro o seu id;

`database` contém duas sub-pastas, além do arquivo do banco de dados em si, em SQLite:
> `files`, que contém apenas um arquivo csv para criação automática de todas as categorias listadas pelo cliente, ao acessar determinada rota para este fim;
> `knex`, que contém os arquivos de migrations, para criação das tables do banco de dados de forma indireta.

Segue abaixo a estrutura das tables existentes:
>> `users`, com os seguintes campos: **id**, do tipo *number*, **admin**, do tipo *boolean*, **name**, do tipo *string*, **email**, do tipo *string*, **password**, do tipo *string*, **created_at**, do tipo *string* e **updated_at**, do tipo *string*. Usuários **admin** têm permissão para criar, visualizar, editar e deletar pratos. Ao se cadastrar, o novo usuário é inserido como não admin - para mudar tal status, é necessário fazer a modificação via brute-force no banco de dados.
>> `categories`, com os seguintes campos: **id**, do tipo *number*, **category**, do tipo *string*, **created_at**, do tipo *string* e **updated_at**, do tipo *string*.
>> `dishes`, com os seguintes campos: **id**, do tipo *number*, **category_id**, do tipo *number*, que é uma chave estrangeira referenciando entradas na table `categories`, **dish**, do tipo *string*, **description**, do tipo *string*, **image**, do tipo *string*, **reais** e **cents**, do tipo *number*, **created_at**, do tipo *string* e **updated_at**, do tipo *string*.
>> `ingredients`, com os seguintes campos: **id**, do tipo *number*, **dish_id**, do tipo *number*, que é uma chave estrangeira referenciando entradas na table `dishes`, **ingredient**, do tipo *string*, **created_at**, do tipo *string* e **updated_at**, do tipo *string*.

### Como rodar este projeto localmente

Supondo que você já tenha `git` e `npm` instalados na sua máquina, você deve seguir estes passos simples. Primeiro, vá ao diretório de seu interesse e clone este repositório:

> `git clone https://github.com/victorsgb/food-explorer-backend`

Então, vá para a pasta recém-criada contendo o seu novo repositório local:

> `cd food-explorer-backend`

Instale as dependências do projeto (assumindo que você tenha o pacote `npm` instalado na sua máquina):

> `npm install`

E pronto! Você já pode rodar o projeto em ambiente de desenvolvedor. O servidor será inicializado na porta 3334, após você rodar o seguinte comando:

> `npm run dev`

Caso queira rodar o projeto em ambiente de produção, basta digitar o comando a seguir:

> `npm run start`

E é isso! Espera-se que o servidor esteja rodando normalmente, na porta especificada, pronto para receber solicitações do cliente web, a saber, o [FoodExplorer Frontend](https://github.com/victorsgb/food-explorer-frontend).

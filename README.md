# FoodExplorer Backend

## Estrutura do projeto

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

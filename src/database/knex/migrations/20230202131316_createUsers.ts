exports.up = (knex: { schema: { createTable: (arg0: string, arg1: (table: any) => void) => any; }; fn: { now: () => any; }; }) => knex.schema.createTable('users', table => {
  table.increments('id').primary().notNullable();
  table.boolean('admin').default(false).notNullable();
  table.text('name').notNullable();
  table.text('email').notNullable();
  table.text('password').notNullable();
  table.timestamp('created_at').default(knex.fn.now()).notNullable();
  table.timestamp('updated_at');
});

exports.down = (knex: { schema: { dropTable: (arg0: string) => any; }; }) => knex.schema.dropTable('users');
exports.up = (knex: { schema: { createTable: (arg0: string, arg1: (table: any) => void) => any; }; fn: { now: () => any; }; }) => knex.schema.createTable('dishes', table => {
  table.increments('id').primary().notNullable();
  table.integer('category_id').references('id').inTable('categories').notNullable();
  table.text('dish').notNullable();
  table.text('description').notNullable();
  table.text('image').notNullable();
  table.integer('reais').notNullable();
  table.integer('cents').notNullable();
  table.timestamp('created_at').default(knex.fn.now()).notNullable();
  table.timestamp('updated_at');
});

exports.down = (knex: { schema: { dropTable: (arg0: string) => any; }; }) => knex.schema.dropTable('dishes');
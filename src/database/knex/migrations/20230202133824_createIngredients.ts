exports.up = (knex: { schema: { createTable: (arg0: string, arg1: (table: any) => void) => any; }; fn: { now: () => any; }; }) => knex.schema.createTable('ingredients', table => {
  table.increments('id').primary().notNullable();
  table.integer('dish_id').references('id').inTable('dishes').onDelete('CASCADE').notNullable();
  table.text('ingredient').notNullable();
  table.timestamp('created_at').default(knex.fn.now()).notNullable();
  table.timestamp('updated_at');
});

exports.down = (knex: { schema: { dropTable: (arg0: string) => any; }; }) => knex.schema.dropTable('ingredients');
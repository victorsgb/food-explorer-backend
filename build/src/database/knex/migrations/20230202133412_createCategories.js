"use strict";
exports.up = (knex) => knex.schema.createTable('categories', table => {
    table.increments('id').primary().notNullable();
    table.text('category').notNullable();
    table.timestamp('created_at').default(knex.fn.now()).notNullable();
    table.timestamp('updated_at');
});
exports.down = (knex) => knex.schema.dropTable('categories');

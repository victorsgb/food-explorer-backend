"use strict";
exports.up = (knex) => knex.schema.createTable('ingredients', table => {
    table.increments('id').primary().notNullable();
    table.integer('dish_id').references('id').inTable('dishes').onDelete('CASCADE').notNullable();
    table.text('ingredient').notNullable();
    table.timestamp('created_at').default(knex.fn.now()).notNullable();
    table.timestamp('updated_at');
});
exports.down = (knex) => knex.schema.dropTable('ingredients');

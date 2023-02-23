"use strict";
exports.up = (knex) => knex.schema.createTable('users', table => {
    table.increments('id').primary().notNullable();
    table.boolean('admin').default(false).notNullable();
    table.text('name').notNullable();
    table.text('email').notNullable();
    table.text('password').notNullable();
    table.timestamp('created_at').default(knex.fn.now()).notNullable();
    table.timestamp('updated_at');
});
exports.down = (knex) => knex.schema.dropTable('users');

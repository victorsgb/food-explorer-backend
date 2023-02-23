"use strict";
exports.__esModule = true;
var path = require("path");
var config = {
    development: {
        client: 'sqlite3',
        connection: {
            filename: path.resolve(__dirname, 'src', 'database', 'database.db')
        },
        pool: {
            afterCreate: function (conn, cb) { return conn.run('PRAGMA foreign_keys = ON', cb); }
        },
        migrations: {
            directory: path.resolve(__dirname, 'src', 'database', 'knex', 'migrations')
        },
        useNullAsDefault: true
    }
};
exports["default"] = config;

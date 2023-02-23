"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const config = {
    development: {
        client: 'sqlite3',
        connection: {
            filename: path_1.default.resolve(__dirname, 'src', 'database', 'database.db')
        },
        pool: {
            afterCreate: (conn, cb) => conn.run('PRAGMA foreign_keys = ON', cb)
        },
        migrations: {
            directory: path_1.default.resolve(__dirname, 'src', 'database', 'knex', 'migrations')
        },
        useNullAsDefault: true
    }
};
exports.default = config;

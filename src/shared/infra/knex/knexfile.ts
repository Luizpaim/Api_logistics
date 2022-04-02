import path from 'path';
// Update with your config settings.

export default {
    development: {
        client: 'mysql2',
        connection: {
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            database: process.env.DB_DATABASE,
            password: process.env.DB_PASS,
            charset: 'utf8',
            supportBigNumbers: true,
            bigNumberStrings: true,
            decimalNumbers: true
        },
        migrations: {
            directory: path.resolve(__dirname, 'migrations')
        },
        seeds: {
            directory: path.resolve(__dirname, 'seeds')
        }
    },
    test: {
        client: 'mysql2',
        connection: {
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            database: process.env.DB_DATABASE,
            password: process.env.DB_PASS,
            charset: 'utf8',
            supportBigNumbers: true,
            bigNumberStrings: true,
            decimalNumbers: true
        },
        migrations: {
            directory: path.resolve(__dirname, 'migrations')
        },
        seeds: {
            directory: path.resolve(__dirname, 'seeds')
        }
    },
    production: {
        client: 'mysql2',
        connection: {
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            database: process.env.DB_DATABASE,
            password: process.env.DB_PASS,
            charset: 'utf8',
            supportBigNumbers: true,
            bigNumberStrings: true,
            decimalNumbers: true
        },
        migrations: {
            directory: path.resolve(__dirname, 'migrations')
        },
        seeds: {
            directory: path.resolve(__dirname, 'seeds')
        }
    }
};

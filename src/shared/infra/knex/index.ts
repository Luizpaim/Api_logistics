import knex from 'knex';

import configuration from './knexfile';

let config;

if (process.env.NODE_ENV === 'test') {
    config = configuration.test;
} else if (process.env.NODE_ENV === 'production') {
    config = configuration.production;
} else {
    config = configuration.development;
}

const connection = knex(config);

export { connection };

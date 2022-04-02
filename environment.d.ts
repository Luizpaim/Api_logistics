/* eslint-disable @typescript-eslint/naming-convention */
declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NODE_ENV: 'development' | 'test' | 'production';
            PORT: number;

            DB_HOST: string;
            DB_USER: string;
            DB_DATABASE: string;
            DB_PASS: string;
            HASH_AUTH_SECRET: string;
            HASH_ID_SECRET: string;
            BASE_CHECKOUT: string;
            MASTER_PASSWORD: string;
        }
    }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};

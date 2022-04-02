/* eslint-disable consistent-return */
import cors from 'cors';
import { Application } from 'express';

export default (app: Application): void => {
    const whitelist = /(b4you.com.br|pagpro.com.br|b4starter.com.br)$/;
    const corsOptions = {
        origin(origin, next) {
            if (whitelist.test(origin)) {
                next(null, true);
            } else {
                next(null, false);
            }
        }
    };

    app.use(cors(corsOptions));
};

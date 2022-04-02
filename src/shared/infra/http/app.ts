/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable class-methods-use-this */
import corsExpress from 'cors';
import express, { json } from 'express';
import 'express-async-errors';
import 'reflect-metadata';
import { hashIdConfig } from '@b4-org/hash-id';
import {
  validateErrorsMiddleware,
  notFoundError,
  appErrorMiddleware,
  authConfig,
  hashIdConfig as hashIdConfigValidate,
  recaptchaConfig,
} from '@b4-org/middleware-express';
import * as Sentry from '@sentry/node';
import * as Tracing from '@sentry/tracing';
import sentryConfig from '@shared/config/sentry';
import '@shared/container';
import cors from '@shared/infra/http/middleware/cors';
import routes from '@shared/infra/http/routes';
import { CorreiosRepository } from '@modules/Correios/infra/knex/repositories/CorreiosRepository';


class App {
  public express: express.Application;

  public constructor() {
    this.express = express();
  }

  public async start(port: number, callback: () => void) {
    this.startConfig();
    this.database();
    this.middlewares();

    this.startValidateError();
    this.routes();
    this.onError();
    await new CorreiosRepository().getServices();

    return this.express.listen(port, callback);
  }

  private startConfig(): void {
    authConfig({ secretKey: process.env.HASH_AUTH_SECRET || '' });
    const hashIdInstance = hashIdConfig({
      secretKey: process.env.HASH_ID_SECRET,
    });
    hashIdConfigValidate({ hashIdInstance });
    recaptchaConfig({
      minScore: 0.5,
      key: process.env.RECAPTCHA_KEY || '',
    });
  }

  private database(): void {}

  private middlewares(): void {
    this.express.use(json());
    if (process.env.NODE_ENV === 'production') {
      cors(this.express);
    } else {
      this.express.use(corsExpress({ origin: '*', allowedHeaders: '*' }));
    }
  }

  private routes(): void {
    routes(this.express);
  }

  private startValidateError(): void {
    Sentry.init({
      ...sentryConfig,
      integrations: [new Sentry.Integrations.Http({ tracing: true }), new Tracing.Integrations.Express({ app: this.express })],
    });

    this.express.use(Sentry.Handlers.tracingHandler());
    this.express.use(Sentry.Handlers.requestHandler());
  }

  private onError(): void {
    this.express.use(validateErrorsMiddleware());
    this.express.use('/', notFoundError({ defaultMessage: "Sorry can't find that!" }));
    this.express.use(Sentry.Handlers.errorHandler());
    this.express.use(
      appErrorMiddleware({
        defaultMessage: 'Internal Error!',
        defaultStatusError: '500 Internal Server Error',
        defaultCode: 'internalError',
      })
    );
  }
}

export default new App();

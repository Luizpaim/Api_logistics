import * as Sentry from '@sentry/node';

export default {
    dsn: process.env.SENTRY_DNS,
    tracesSampleRate: 1.0,
    release: process.env.npm_package_version,
    initialScope: {
        tags: {
            version: process.env.npm_package_version,
            environment: process.env.NODE_ENV
        }
    },
    integrations: [new Sentry.Integrations.Http({ tracing: true })],
    ...(process.env.NODE_ENV === 'development' && {
        debug: true,
        enabled: false
    })
} as Sentry.NodeOptions;

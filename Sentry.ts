import * as Sentry from '@sentry/node';
import ConfigSentry from '../../config/sentry';

Sentry.init(ConfigSentry);

export default Sentry;

import { Joi, Segments, validate } from '@b4-org/middleware-express';

export default {
  trackingCorreios: validate({
    [Segments.BODY]: Joi.object().keys({
      trackingCode: Joi.string().required(),
    }),
  }),
};

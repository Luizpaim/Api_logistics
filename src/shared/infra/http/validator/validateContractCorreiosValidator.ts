import { Joi, Segments, validate } from '@b4-org/middleware-express';

export default {
  validateContract: validate({
    [Segments.BODY]: Joi.object().keys({
      user: Joi.string().required(),
      password: Joi.string().required(),
      postalCard: Joi.string().required(),
    }),
  }),
};

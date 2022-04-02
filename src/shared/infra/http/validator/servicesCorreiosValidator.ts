import { Joi, Segments, validate } from '@b4-org/middleware-express';

export default {
  servicesCorreios: validate({
    [Segments.BODY]: Joi.object().keys({
      user: Joi.string().required(),
      password: Joi.string().required(),
      postalCard: Joi.string().required(),
      contractId: Joi.string().required(),
    }),
  }),
};

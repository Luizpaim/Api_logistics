import { Joi, Segments, validate } from '@b4-org/middleware-express';

export default {
  priceCorreios: validate({
    [Segments.BODY]: Joi.object().keys({
      idLot: Joi.string().required(),
      idSender: Joi.string().required(),
      idContract: Joi.string().required(),
    }),
  }),
};

import { Joi, Segments, validate } from '@b4-org/middleware-express';

export default {
  blockObject: validate({
    [Segments.BODY]: Joi.object().keys({
      idPlp: Joi.string().required(),
      idTracking: Joi.string().required(),
    }),
  }),
};

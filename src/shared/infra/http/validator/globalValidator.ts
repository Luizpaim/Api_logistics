import { Joi, Segments, validate } from '@b4-org/middleware-express/Validate';

export default validate({
    [Segments.HEADERS]: Joi.object({
        'x-platform': Joi.string()
            .valid('b4you', 'starter', 'member', 'broi', 'btask', 'alexa')
            .required()
    }).unknown()
});

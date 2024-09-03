import * as Joi from 'joi';

export const JoiValidationSchema = Joi.object({
  MONGODB: Joi.required(), // if MONGODB is not provided it throws an error
  PORT: Joi.number().default(3005),
  DEFAULT_SEARCH_LIMIT: Joi.number().default(5),
});

import * as Joi from 'joi';
export const validationSchema = Joi.object({
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().default(5432),
  DB_USER: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_NAME: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRES_IN: Joi.string().default('1h'),
  REDIS_HOST: Joi.string().required(),
  REDIS_PORT: Joi.number().default(6379),
}).unknown(true); 
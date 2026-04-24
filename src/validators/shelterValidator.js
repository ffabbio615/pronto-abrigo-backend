import Joi from 'joi';

export const registerShelterSchema = Joi.object({
  name: Joi.string().min(3).required(),

  description: Joi.string().min(10).required(),

  address: Joi.string().min(5).required(),

  email: Joi.string().email().required(),

  password: Joi.string()
    .pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,16}$/)
    .required()
    .messages({
      'string.pattern.base':
        'Senha deve ter 8-16 caracteres, 1 maiúscula, 1 número e 1 especial'
    }),

  type: Joi.string().valid('human', 'animal').required(),

  capacity: Joi.number().integer().min(1).required()
});

export const updateShelterSchema = Joi.object({
  name: Joi.string().min(3),

  address: Joi.string().min(5),

  password: Joi.string().pattern(
    /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,16}$/
  ),

  latitude: Joi.number(),

  longitude: Joi.number(),

  capacity: Joi.number().integer().min(1),

  status: Joi.string().valid('open', 'closed'),

  photo_url: Joi.string().uri()
});
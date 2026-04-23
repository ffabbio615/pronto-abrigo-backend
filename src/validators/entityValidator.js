import Joi from 'joi';

export const createEntitySchema = Joi.object({
  name: Joi.string().optional(),

  birth_date: Joi.date().optional(),

  estimated_age: Joi.number().optional(),

  species: Joi.string().optional(),

  description: Joi.string().optional(),

  photo_url: Joi.string().uri().optional(),

  allow_public_photo: Joi.boolean().required(),

  status: Joi.string()
    .valid('in_shelter', 'looking_for_family')
    .required()
});
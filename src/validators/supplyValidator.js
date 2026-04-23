import Joi from 'joi';

export const createSupplySchema = Joi.object({
  name: Joi.string().required(),

  min_quantity: Joi.number().min(0).required(),

  max_quantity: Joi.number().min(0).required(),

  current_quantity: Joi.number().min(0).optional()
});
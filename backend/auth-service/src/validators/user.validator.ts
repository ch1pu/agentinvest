import Joi from 'joi';

/**
 * Update user validation schema
 */
export const updateUserSchema = Joi.object({
  first_name: Joi.string()
    .min(1)
    .max(100)
    .optional()
    .messages({
      'string.min': 'First name cannot be empty',
      'string.max': 'First name must not exceed 100 characters',
    }),
  last_name: Joi.string()
    .min(1)
    .max(100)
    .optional()
    .messages({
      'string.min': 'Last name cannot be empty',
      'string.max': 'Last name must not exceed 100 characters',
    }),
  phone: Joi.string()
    .pattern(/^\+?[\d\s-()]+$/)
    .optional()
    .allow(null, '')
    .messages({
      'string.pattern.base': 'Please provide a valid phone number',
    }),
  avatar_url: Joi.string()
    .uri()
    .optional()
    .allow(null, '')
    .messages({
      'string.uri': 'Please provide a valid URL',
    }),
  preferences: Joi.object()
    .optional()
    .messages({
      'object.base': 'Preferences must be an object',
    }),
});

import Joi from 'joi';

/**
 * User registration validation schema
 */
export const registerSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required',
    }),
  password: Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .required()
    .messages({
      'string.min': 'Password must be at least 8 characters long',
      'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
      'any.required': 'Password is required',
    }),
  first_name: Joi.string()
    .min(1)
    .max(100)
    .required()
    .messages({
      'string.min': 'First name is required',
      'string.max': 'First name must not exceed 100 characters',
      'any.required': 'First name is required',
    }),
  last_name: Joi.string()
    .min(1)
    .max(100)
    .required()
    .messages({
      'string.min': 'Last name is required',
      'string.max': 'Last name must not exceed 100 characters',
      'any.required': 'Last name is required',
    }),
  phone: Joi.string()
    .pattern(/^\+?[\d\s-()]+$/)
    .optional()
    .messages({
      'string.pattern.base': 'Please provide a valid phone number',
    }),
});

/**
 * User login validation schema
 */
export const loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required',
    }),
  password: Joi.string()
    .required()
    .messages({
      'any.required': 'Password is required',
    }),
});

/**
 * Refresh token validation schema
 */
export const refreshSchema = Joi.object({
  refreshToken: Joi.string()
    .required()
    .messages({
      'any.required': 'Refresh token is required',
    }),
});

/**
 * Email verification validation schema
 */
export const verifyEmailSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required',
    }),
  token: Joi.string()
    .required()
    .messages({
      'any.required': 'Verification token is required',
    }),
});

/**
 * Password reset request validation schema
 */
export const resetPasswordRequestSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required',
    }),
});

/**
 * Password reset validation schema
 */
export const resetPasswordSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required',
    }),
  token: Joi.string()
    .required()
    .messages({
      'any.required': 'Reset token is required',
    }),
  newPassword: Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .required()
    .messages({
      'string.min': 'Password must be at least 8 characters long',
      'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
      'any.required': 'New password is required',
    }),
});

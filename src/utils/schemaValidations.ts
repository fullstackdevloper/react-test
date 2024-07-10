import Joi from 'joi';

export const movieSchema = Joi.object({
  movieTitle: Joi.string().required().messages({
    'string.base': 'Movie title should be a type of text',
    'string.empty': 'Movie title cannot be an empty field',
    'any.required': 'Movie title is required'
  }),
  publishingYear: Joi.number().required().messages({
    'number.base': 'Publishing year should be a type of number',
    'number.empty': 'Publishing year cannot be an empty field',
    'number.positive': 'Publishing year must be a positive number',
    'any.required': 'Publishing year is required'
  }),
  image: Joi.any(), 
});

export const updateMovieSchema = Joi.object({
  movieTitle: Joi.string().optional().messages({
    'string.base': 'Movie title should be a type of text',
    'string.empty': 'Movie title cannot be an empty field'
  }),
  publishingYear: Joi.number().integer().positive().optional().messages({
    'number.base': 'Publishing year should be a type of number',
    'number.empty': 'Publishing year cannot be an empty field',
    'number.positive': 'Publishing year must be a positive number'
  }),
  image: Joi.any().optional(),
});

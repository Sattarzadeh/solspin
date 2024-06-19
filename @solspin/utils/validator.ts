import Joi from "joi";
import { ValidationError, UnknownValidationTypeError } from "../errors/src/index";
// Define Joi schemas for validation
const schemas = {
  uuid: Joi.string().uuid(),
  url: Joi.string().uri(),
  numeric: Joi.number(),
  alpha: Joi.string().regex(/^[a-zA-Z]+$/),
  alphanumeric: Joi.string().regex(/^[a-zA-Z0-9]+$/),
  int: Joi.number().integer(),
  float: Joi.number(),
  boolean: Joi.boolean(),
};

export const validateInput = (input: any, type: keyof typeof schemas): boolean => {
  const schema = schemas[type];
  if (!schema) {
    throw new UnknownValidationTypeError(type);
  }
  const { error } = schema.validate(input);
  if (error) {
    throw new ValidationError(type, error.details[0].message);
  }
  return true;
};

export const validateUserInput = (input: any, type: keyof typeof schemas): any => {
  validateInput(input, type);
  return input;
};

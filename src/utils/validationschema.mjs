import { body } from 'express-validator';

export const createUserValidationSchema = [
  body('username')
    .isString() // Check if the username is a string
    .notEmpty() // Check if it's not empty
    .withMessage('Username is required') // Custom error message for empty field
    .isLength({ min: 5, max: 32 }) // Check if the length is between 5 and 32
    .withMessage('Username must be between 5 and 32 characters')
    .displayname('displayname')
    .isString() // Check if the displayname is a string
];

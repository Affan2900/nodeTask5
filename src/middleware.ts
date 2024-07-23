import { Request, Response, NextFunction } from 'express';
import { body,param, validationResult } from 'express-validator';

//global error handler
export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack); // Log error stack trace (for debugging)

  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }) // Optional: include stack trace in development mode
  });
};

// Middleware to validate user ID
export const validateUserId = [
  param('id').isMongoId().withMessage('User ID must be a valid MongoDB ID'),
  handleValidationErrors,
];

// Middleware to validate user creation
export const validateUserCreate = [
  body('name').isString().notEmpty().withMessage('Name is required and must be a string'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  handleValidationErrors
];

// Middleware to validate user update
export const validateUserUpdate = [
  body('name').optional().isString().notEmpty().withMessage('Name must be a non-empty string'),
  body('email').optional().isEmail().withMessage('Valid email format required'),
  body('password').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  handleValidationErrors
];

// Middleware to validate 'GET' request for a specific to-do of a user
export const validateUserIdAndToDoIdParams = [
  param('id').isMongoId().withMessage('User ID must be a MongoDB ID'),
  param('toDoId').isMongoId().withMessage('To-do ID must be a MongoDB ID'),
  handleValidationErrors,
];

// Middleware to validate 'GET' request for a to-do by ID
export const validateToDoById = [
  param('id').isMongoId().withMessage('To-do ID must be a MongoDB ID'),
  handleValidationErrors,
];

// Middleware to validate todo creation
export const validateTodoCreate = [
  body('title').isString().notEmpty().withMessage('Title is required and must be a string'),
  body('userId').isMongoId().withMessage('Valid userId is required'),
  handleValidationErrors
];

// Middleware to validate todo update
export const validateTodoUpdate = [
  body('title').optional().isString().notEmpty().withMessage('Title must be a non-empty string'),
  body('isCompleted').optional().isBoolean().withMessage('isCompleted must be a boolean'),
  handleValidationErrors
];

// Middleware to handle validation errors produced by express-validator
function handleValidationErrors(req: Request, res: Response, next: NextFunction) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}

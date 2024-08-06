import { Request, Response, NextFunction } from 'express';
import { body,param, validationResult } from 'express-validator';
import axios from 'axios';
import multer, { Multer } from 'multer';
import path from 'path';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import { Types } from 'mongoose';

interface User {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  isDisabled: boolean;
  createdDate: Date;
  updatedDate: Date;
}

interface RequestWithUser extends Request {
  user?: User;
}

export const authenticateToken = (req: RequestWithUser, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.status(401).json({ message: 'Unauthorized' });

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string, (err: any, user: any) => {
    if (err) return res.status(403).json({ message: 'Forbidden' });
    req.user = user;
    next();
  });
}

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

const storage: multer.StorageEngine = multer.memoryStorage();

const handleProfilePictureUrl = async (req: Request, res: Response, next: NextFunction) => {
  // Check if profilePictureUrl is present
  if (!req.body.profilePictureUrl) {
    return next(); // If not present, pass control to the next middleware
  }

  console.log('Fetching image from URL:', req.body.profilePictureUrl); // Log the URL

  try {
    // Ensure the uploads directory exists
    const destination = 'uploads/';
    if (!fs.existsSync(destination)) {
      fs.mkdirSync(destination, { recursive: true });
    }

    // Proceed to download and save the image if the URL is present
    const response = await axios.get(req.body.profilePictureUrl, { responseType: 'arraybuffer' });
    
    // Log the response status and headers
    console.log('Response Status:', response.status);
    console.log('Response Headers:', response.headers);

    // Check if the response is an image
    if (!response.headers['content-type'].startsWith('image/')) {
      console.error('The fetched URL does not point to an image.');
      return res.status(400).json({ error: 'The provided URL does not point to an image.' });
    }

    const buffer = Buffer.from(response.data, 'binary');
    const filename = `${Date.now()}${path.extname(req.body.profilePictureUrl)}`;
    
    // Write the file to the uploads directory
    const filePath = path.join(destination, filename);
    fs.writeFileSync(filePath, buffer);
    console.log('Image saved to:', filePath); // Log the saved file path

    req.file = {
      fieldname: 'profilePictureUrl',
      originalname: filename,
      encoding: '7bit',
      mimetype: response.headers['content-type'] as string,
      buffer,
      size: buffer.length,
      destination,
      filename,
      path: filePath,
      stream: fs.createReadStream(filePath), // Include the stream property
    };
    console.log(typeof req.file.path);

    next(); // Proceed to the next middleware
  } catch (error) {
    console.error('Error fetching or saving the image:', error);
    next(error); // Handle any errors that occur during the process
  }
};

const upload: Multer = multer({ storage });
export { upload, handleProfilePictureUrl };

// Middleware to handle validation errors produced by express-validator
function handleValidationErrors(req: Request, res: Response, next: NextFunction) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}

import { Request, Response, NextFunction } from 'express';
import { body,param, validationResult } from 'express-validator';
import {User,IUser} from './models/userModel';
import {ToDo,IToDo} from './models/toDoModel';

// Middleware to check if users list is empty
export const  checkUsersList = async (req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>> => {
  try {
    // Get all users
    const users: IUser[] = await User.find({});

    if (users.length === 0) {
      res.status(200).json({ message: 'There are no current users' });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: 'Error checking users list', error });
  }
  return res;
}

//Middleware to check if user is disabled
export const checkUserIsDisabled = async(req: Request, res: Response, next: NextFunction):Promise<void>=> {
  try{
  const userId = req.params.id; 
  const user: IUser | null = await User.findOne({id: userId});

  if (user!.isDisabled) {
    res.status(200).json({ message: "This user is disabled" });
  }
  next();
}catch(error){
  res.status(500).json({ message: 'Error checking user', error });
}
}

// Middleware to validate 'GET' request for a user by ID
export const validateUserById = [
  param('id').isMongoId().withMessage('Invalid user ID'),
  handleValidationErrors,
  async (req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>> => {

    const userId = req.params.id;
    try{
      const user: IUser | null = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      next();
    }catch(error){
      res.status(500).json({ message: 'Error getting user', error });
    }
    return res;
  },
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
  param('id').isMongoId().withMessage('User ID must be an integer'),
  param('toDoId').isMongoId().withMessage('To-do ID must be an integer'),
  handleValidationErrors,
  async (req: Request, res: Response, next: NextFunction):Promise<Response<any,Record<string,any>>> => {
    try{
    const userId = req.params.id;
    const toDoId = req.params.toDoId;

    const user:IUser | null = await User.findOne({id: userId});
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if the to-do item exists for the user
    const toDo: IToDo | null = await ToDo.findOne({ _id: toDoId, userId });
    if (!toDo) {
      return res.status(404).json({ error: 'To-do item not found for this user' });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: 'Error getting to-do', error });
  }
    return res;
  }
];

// Middleware to check if users list is empty
export const checkToDosList = async (req: Request, res: Response, next: NextFunction):Promise<Response<any, Record<string, any>>> => {
  try{
  const toDos:IToDo[] = await ToDo.find(); // Get all toDos 

  if (toDos.length === 0) {
    return res.status(200).json({ message: "There are no current toDos" });
  }
  next();
}catch(error){
  res.status(500).json({ message: 'Error checking todos list', error });
}
  return res;
}

// Middleware to check if users list is empty of a specific user
export const checkToDosListOfUser = async (req: Request, res: Response, next: NextFunction):Promise<Response<any,Record<string,any>>> => {
  try{
  const userId = req.params.id;
  const toDos:IToDo[] = await ToDo.find({id: userId}); // Get all toDos of a specific user from your todo service

  if (toDos.length === 0) {
    return res.status(200).json({ message: "There are no current toDos of this user" });
  }
  next();
}catch(error){
  res.status(500).json({ message: 'Error checking todos list', error });
}
  return res;
}

// Middleware to validate 'GET' request for a to-do by ID
export const validateToDoById = [
  param('id').isMongoId().withMessage('To-do ID must be an integer'),
  handleValidationErrors,
  async (req: Request, res: Response, next: NextFunction):Promise<Response<any,Record<string,any>>> => {
    try{
    const toDo:IToDo | null = await ToDo.findById(req.params.id);

    if (!toDo) {
      return res.status(404).json({ error: 'To-do not found' });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: 'Error getting to-do', error });
  }
    return res;
  }
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

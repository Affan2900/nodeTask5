import { Request, Response } from 'express';
import { User } from '../models/userModel';
import * as userService from '../services/userService';
import * as toDoService from '../services/toDoService';

export const getAllUsers = (req: Request, res: Response): void => {
  const users = userService.getAllUsers();
  res.json(users);
}

export const getUserById = (req: Request, res: Response): void => {
  const id = Number(req.params.id); // Convert the id to a number
  const user = userService.getUserById(id);
  if(user){
    res.json(user);
  }else{
    res.status(404).json({ message: 'User not found' })
  }
}

export const addUser = (req: Request, res: Response): void => {
  const { name, email, password } = req.body;
  // Create a new User object
  const newUser: User = {
    id: Math.floor(Math.random() * 1000), // Example ID generation, use a proper ID generator or UUID in real cases
    name,
    email,
    password,
    isDisabled: false,
    createdDate: new Date(),
    updatedDate: new Date(),
  };

  // Call the service to add the user
  userService.addUser(newUser);

  // Send response back to client
  res.status(201).json(newUser);
}

export const updateUser = (req: Request, res: Response): void =>{
  const id = Number(req.params.id); // Convert the id to a number
  const { name, email, password } = req.body;
  const user = userService.getUserById(id);
  if(user){
    // Update the user in the database
    user.name = name;
    user.email = email;
    user.password = password;
    user.updatedDate = new Date();
    userService.updateUser(id,user);

    // Send response back to client
    res.status(200).json(user);
  }else{
    res.status(404).json({ message: 'User not found' })
  }
}

export const deleteUser = (req: Request, res: Response): void =>{
  const id = Number(req.params.id); // Convert the id to a number
  const user = userService.getUserById(id);
  if(user){
    // Delete the user from the database
    userService.deleteUser(id);

    // Send response back to client
    res.status(200).json({ message: 'User deleted successfully' });
  }else{
    res.status(404).json({ message: 'User not found' })
  }
}

export const getAllToDosOfUser = (req: Request, res: Response) => {
  const userId = parseInt(req.params.id, 10); // Convert the id from string to number

  if (isNaN(userId)) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }

  const todos = toDoService.getToDoById(userId);

  if (todos === undefined) {
    return res.status(404).json({ message: 'No todos found for this user' });
  }

  res.json(todos);
}

export const getToDosByUserId = (req: Request, res: Response) => {
  try {
    // Get the user ID from the request
    const userId = Number(req.params.id);
    if (isNaN(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }
    const todos = toDoService.getToDoById(userId);
    if (todos === undefined) {
      return res.status(404).json({ message: 'No todos found for this user' });
    }
    res.json(todos);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
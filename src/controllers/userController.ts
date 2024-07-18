import { Request, Response } from 'express';
import { User, IUser } from '../models/userModel';
import { ToDo, IToDo } from '../models/toDoModel';
import shortid from 'shortid';

//Method to get all users
export const getAllUsers = async (req: Request, res: Response)=> {
  try {
    const users: IUser[] = await User.find({});
    res.json(users);
  } catch (error) {
    // Handle the error
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(400).json({ message: 'An unknown error occurred' });
    }
  }
}

//Method to get user by id
export const getUserById = async (req: Request, res: Response): Promise<void> => {
  try{
  const user:IUser | null = await User.findById(req.params.id);
  if(user){
    res.json(user);
  }else{
    res.status(404).json({ message: 'User not found' })
  }
} catch (error) {
  res.status(500).json({ message: 'Error getting user', error });
  }
}

//Method to add user
export const addUser = async (req: Request, res: Response): Promise<void> => {
  try{ // To avoid unhandled promise rejection
    const { name, email, password } = req.body;
  // Create a new User object
  const newUser = new User ({
    id: shortid.generate(),
    name,
    email,
    password,
    isDisabled: false,
    createdDate: new Date(),
    updatedDate: new Date(),
  });

  // Call the service to add the user
  const savedUser: IUser = await newUser.save();

  // Send response back to client
  res.status(201).json(savedUser);
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error });
  }
}

//Method to update user
export const updateUser = async (req: Request, res: Response): Promise<Response<any, Record<string, any>>> => {
  try {
    const id = req.params.id;
    const { name, email, password } = req.body;

    const updatedFields: Partial<IUser> = {
      name: name !== undefined ? name : undefined,
      email: email !== undefined ? email : undefined,
      password: password !== undefined ? password : undefined,
      updatedDate: new Date(),
    };

    // Find the user by ID and update it
    const updatedUser = await User.findByIdAndUpdate(
      id,
      updatedFields,
      { new: true, runValidators: true }
    );

    if (updatedUser) {
      res.status(200).json(updatedUser);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  }
  catch (error) {
    res.status(500).json({ message: 'Error updating user', error });
  }
  return res;
};


//Method to delete user
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id;

    // Find the user by ID and delete it | method requires a single argument and not an object
    const deletedUser: IUser | null = await User.findByIdAndDelete(id);

    if (deletedUser) {
      // Send response back to client
      res.status(200).json({
        message: 'User deleted successfully',
        user: deletedUser,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error });
  }
};


//Method to get all toDos of user
export const getAllToDosOfUser = async (req: Request, res: Response):Promise<Response<any, Record<string, any>>> => {
  try{
  const id = req.params.id; 

  const user:IUser | null = await User.findOne({ id });
  if(user){
  const todos:IToDo[] = await ToDo.find({ id });

  if (todos.length === 0) {
    return res.status(404).json({ message: 'No todos found for this user' });
  }

  res.json(todos);
  } else{
    res.status(404).json({ message: 'User not found' })
  }
  }catch(error){
    res.status(500).json({ message: 'Error getting todos', error });
  }
  return res;
}

//Method to get toDo by userId and toDoId
export const getToDoByUserIdAndToDoId = async (req: Request, res: Response):Promise<Response<any, Record<string, any>>> => {

    try{
    // Get the user ID from the request
    const userId = req.params.id;
    //Get the toDo Id
    const toDoId = req.params.toDoId;

    
    const user:IUser | null = await User.findOne({ id: userId }); 

    if (user) {
      const todo:IToDo | null = await ToDo.findOne({ id: toDoId });
      if (todo) {
        res.json(todo);
      } else {
        res.status(404).json({ message: 'No todo found for this user' });
      }
    }else{
      res.status(404).json({ message: 'User not found' });
    }
  }catch(error){
    res.status(500).json({ message: 'Error getting todo', error });
  }

    return res;
}
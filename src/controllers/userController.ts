import { Request, Response } from 'express';
import { User, IUser } from '../models/userModel';
import { ToDo, IToDo } from '../models/toDoModel';
import shortid from 'shortid';

//Method to get all users
export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
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
export const getUserById = async (req: Request, res: Response): Promise<Response<any, Record<string, any>>> => {
  try{
  
  const user:IUser | null = await User.findById(req.params.id);
  if(user){
    return res.json(user);
  }else{
    return res.status(404).json({ message: 'User not found' })
  }
} catch (error) {
  return res.status(500).json({ message: 'Error getting user', error });
  }
}

//Method to add user
export const addUser = async (req: Request, res: Response): Promise<Response<any, Record<string, any>>> => {
  try{ 
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
  return res.status(201).json(savedUser);
  } catch (error) {
    console.error('Error creating user:', error);
    return res.status(500).json({ message: 'Error creating user' });
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

export const deleteUser = async (req: Request, res: Response): Promise<Response<any, Record<string,any>>> => {
  try {
    const id = req.params.id;

    // Find the user by ID and delete it | method requires a single argument and not an object
    const deletedUser: IUser | null = await User.findByIdAndDelete(id);

    if (deletedUser) {
      //delete ToDos asscoiated with the user
      await ToDo.deleteMany({ userId: id });
      // Send response back to client
      return res.status(200).json({
        message: 'User deleted successfully',
        user: deletedUser,
      });
    } else {
      return res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Error deleting user', error });
  }
};


//Method to get all toDos of user
export const getAllToDosOfUser = async (req: Request, res: Response):Promise<Response<any, Record<string, any>>> => {
  try{
  const userId = req.params.id;
  const user:IUser | null = await User.findById(req.params.id);
  if(user){
  const todos:IToDo[] = await ToDo.find({ userId: userId });

  if (todos.length === 0) {
    return res.status(404).json({ message: 'No todos found for this user' });
  }

  res.json(todos);
  } else{
    return res.status(404).json({ message: 'User not found' })
  }
  }catch(error){
    return res.status(500).json({ message: 'Error getting todos', error });
  }
  return res;
}

//Method to get toDo by userId and toDoId
export const getToDoByUserIdAndToDoId = async (req: Request, res: Response):Promise<Response<any, Record<string, any>>> => {

    try{
      const toDoId = req.params.toDoId;
      const userId = req.params.id;
    
    const user:IUser | null = await User.findById(userId); 
    if (user) {
      // console.log("toDoId:", toDoId, "userId:", userId);
      
      const todo:IToDo | null = await ToDo.findOne({ _id: toDoId, userId: userId });
      if (todo) {
        return res.json(todo);
      } else {
        return res.status(404).json({ message: 'No todo found for this user' });
      }
    }else{
      return res.status(404).json({ message: 'User not found' });
    }
  }catch(error){
    return res.status(500).json({ message: 'Error getting todo', error });
  }
}
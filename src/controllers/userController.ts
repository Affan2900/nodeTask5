import { Request, Response } from 'express';
import { User, IUser } from '../models/userModel';
import { ToDo, IToDo } from '../models/toDoModel';

// Method to get all users
export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  const users: IUser[] = await User.find({});
  res.json(users);
};

// Method to get user by id
export const getUserById = async (req: Request, res: Response): Promise<void> => {
  const user: IUser | null = await User.findById(req.params.id);
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

// Method to add user
export const addUser = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password } = req.body;

  const newUser = new User({
    name,
    email,
    password,
    createdDate: new Date(),
    updatedDate: new Date(),
  });

  const savedUser: IUser = await newUser.save();
  res.status(201).json(savedUser);
};

// Method to update user
export const updateUser = async (req: Request, res: Response): Promise<void> => {
  const id = req.params.id;
  const { name, email } = req.body;

  const updatedFields: Partial<IUser> = {
    name: name !== undefined ? name : undefined,
    email: email !== undefined ? email : undefined,
    updatedDate: new Date(),
  };

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
};

// Method to delete user
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  const id = req.params.id;
  const deletedUser: IUser | null = await User.findByIdAndDelete(id);

  if (deletedUser) {
    // Delete all todos associated with the deleted user
    await ToDo.deleteMany({ userId: id });

    res.status(200).json({
      message: 'User and associated todos deleted successfully',
      user: deletedUser,
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};


// Method to get all toDos of user
export const getAllToDosOfUser = async (req: Request, res: Response): Promise<void> => {
  const userId = req.params.id;
  const user: IUser | null = await User.findById(req.params.id);
  
  if (!user) {
    res.status(404).json({ message: 'User not found' });
    return;
  }

  const todos: IToDo[] = await ToDo.find({ userId: userId });

  if (todos.length === 0) {
    res.status(404).json({ message: 'No todos found for this user' });
    return;
  }

  res.json(todos);
};

// Method to get toDo by userId and toDoId
export const getToDoByUserIdAndToDoId = async (req: Request, res: Response): Promise<void> => {
  const toDoId = req.params.toDoId;
  const userId = req.params.id;

  const user: IUser | null = await User.findById(userId);
  if (!user) {
    res.status(404).json({ message: 'User not found' });
    return;
  }

  const todo: IToDo | null = await ToDo.findOne({ _id: toDoId, userId: userId });
  if (todo) {
    res.json(todo);
  } else {
    res.status(404).json({ message: 'No todo found for this user' });
  }
};
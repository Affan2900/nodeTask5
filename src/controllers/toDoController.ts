// controllers/todoController.ts

import { Request, Response } from 'express';
import { ToDo, IToDo } from '../models/toDoModel';
import { User, IUser } from '../models/userModel';
import shortid from 'shortid';

// Method to get all toDos
export const getAllToDos = async (req: Request, res: Response): Promise<void> => {
  const toDos: IToDo[] = await ToDo.find({});
  res.json(toDos);
};

// Method to get toDo by id
export const getToDoById = async (req: Request, res: Response): Promise<void> => {
  const toDo: IToDo | null = await ToDo.findById(req.params.id);
  if (toDo) {
    res.json(toDo);
  } else {
    res.status(404).json({ message: 'ToDo not found' });
  }
};

// Method to add toDo
export const addToDo = async (req: Request, res: Response): Promise<void> => {
  const { title, userId } = req.body;

  const user: IUser | null = await User.findById(userId);
  if (!user) {
    res.status(404).json({ message: 'User not found' });
    return;
  }

  const newToDo = new ToDo({
    id: shortid.generate(),
    title,
    userId,
    isCompleted: false,
    createdDate: new Date(),
    updatedDate: new Date(),
  });

  const savedToDo: IToDo = await newToDo.save();
  res.status(201).json(savedToDo);
};

// Method to update toDo
export const updateToDo = async (req: Request, res: Response): Promise<void> => {
  const id = req.params.id;
  const { title, userId } = req.body;

  const user = await User.findById(userId);
  if (!user) {
    res.status(404).json({ message: 'User not found' });
    return;
  }

  const updatedFields: Partial<IToDo> = {
    title: title !== undefined ? title : undefined,
    userId: userId !== undefined ? userId : undefined,
    updatedDate: new Date(),
  };

  const updatedToDo = await ToDo.findByIdAndUpdate(
    id,
    updatedFields,
    { new: true, runValidators: true }
  );

  if (updatedToDo) {
    res.status(200).json(updatedToDo);
  } else {
    res.status(404).json({ message: 'To Do not found' });
  }
};

// Method to delete toDo
export const deleteToDo = async (req: Request, res: Response): Promise<void> => {
  const id = req.params.id;
  const deletedToDo: IToDo | null = await ToDo.findByIdAndDelete(id);

  if (deletedToDo) {
    res.status(200).json({
      message: 'To-Do deleted successfully',
      toDo: deletedToDo,
    });
  } else {
    res.status(404).json({ message: 'To-Do not found' });
  }
};

import { Request, Response } from 'express';
import { toDo } from '../models/toDoModel';
import * as toDoService from '../services/toDoService';

export const getAllToDos = (req: Request, res: Response): void =>{
  const toDos = toDoService.getAllToDos();
  res.json(toDos);
}

export const getToDoById = (req: Request, res: Response): void =>{
  const id = Number(req.params.id); // Convert the id to a number
  const toDo = toDoService.getToDoById(id);
  if(toDo){
    res.json(toDo);
  }else{
    res.status(404).json({ message: 'ToDo not found' })
  }
}

export const addToDo = (req: Request, res: Response): void =>{
  const { title, userId } = req.body;

  // Parse userId to number
  const parsedUserId = Number(userId);
  // Create a new ToDo object
  const newToDo: toDo = {
    id : Math.floor(Math.random() * 1000),
    title,
    userId: parsedUserId,
    isCompleted: false,
    createdDate: new Date(),
    updatedDate: new Date(),
  }

  toDoService.addToDo(newToDo);

  // Send response back to client
  res.status(201).json(newToDo);
}

export const updateToDo = (req: Request, res: Response): void =>{
  const id = Number(req.params.id); // Convert the id to a number
  const { title, userId } = req.body;
  const toDo = toDoService.getToDoById(id);
  if(toDo){
    // Update the toDo in the database
    toDo.title = title;
    toDo.userId = userId;
    toDo.updatedDate = new Date();
    toDoService.updateToDo(id,toDo);

    // Send response back to client
    res.status(200).json(toDo);
  }else{
    res.status(404).json({ message: 'ToDo not found' })
  }
}

export const deleteToDo = (req: Request, res: Response): void =>{
  const id = Number(req.params.id); // Convert the id to a number
  const toDo = toDoService.getToDoById(id);
  if(toDo){
    // Delete the toDo from the database
    toDoService.deleteToDo(id);

    // Send response back to client
    res.status(200).json(toDo);
  }else{
    res.status(404).json({ message: 'ToDo not found' })
  } 
}



import { toDo } from '../models/toDoModel';

let toDos: toDo[] = [];

export const getAllToDos = (): toDo[] => toDos;

export const getToDoById = (id: number): toDo | undefined =>{
  const toDo = toDos.find( toDo => toDo.id === id)
  if(toDo){
    return toDo;
  }
  return undefined;
}



export const addToDo = (toDo: toDo): void =>{
  toDos.push(toDo);
}

export const updateToDo = (id: number, updatedToDo: toDo): toDo | undefined  =>{
  const index = toDos.findIndex(toDo => toDo.id === id);
  if(index !== -1){
    toDos[index] = updatedToDo;
    return toDos[index];
  }
  return undefined;
}

export const deleteToDo = (id: number): void =>{
  toDos = toDos.filter(toDo => toDo.id !== id);
}

// Method to get todos by user ID
export const getToDosByUserId = (userId: number): toDo[] => {
  return toDos.filter(todo => todo.userId === userId);
};
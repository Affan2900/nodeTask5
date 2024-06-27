import { User } from '../models/userModel';

let users: User[] = [];

export const getAllUsers = (): User[] => users;

export const getUserById = (id: number): User | undefined =>{
  const user = users.find( user => user.id === id)
  if(user){
    return user;
  }
  return undefined;
}

export const addUser = (user: User): void =>{
  users.push(user);
}

export const updateUser = (id: number, updatedUser: User): User | undefined  =>{
  const index = users.findIndex(user => user.id === id);
  if(index !== -1){
    users[index] = updatedUser;
    return users[index];
  }
  return undefined;
}

export const deleteUser = (id:number): void =>{
  users = users.filter(user => user.id !== id);
}



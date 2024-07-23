import express from 'express';
import * as userController from '../controllers/userController';
import { validateUserCreate, validateUserUpdate,validateUserIdAndToDoIdParams,validateUserId } from '../middleware';

// Create a router
const router = express.Router();

// Add routes to the router
router.get('/users', userController.getAllUsers);
router.get('/users/:id',validateUserId, userController.getUserById);
router.post('/users', validateUserCreate, userController.addUser);
router.put('/users/:id',validateUserUpdate, userController.updateUser);
router.patch('/users/:id',validateUserUpdate, userController.updateUser);
router.delete('/users/:id',validateUserId, userController.deleteUser);
router.get('/users/:id/todos',validateUserId, userController.getAllToDosOfUser);
router.get('/users/:id/todos/:toDoId',validateUserIdAndToDoIdParams,  userController.getToDoByUserIdAndToDoId);  

export default router;
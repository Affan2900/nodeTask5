import express from 'express';
import * as userController from '../controllers/userController';
import { validateUserCreate, validateUserUpdate,validateUserIdAndToDoIdParams,validateUserId, authenticateToken } from '../middleware';

// Create a router
const router = express.Router();

// Add routes to the router
router.get('/users/login',userController.loginUser)
router.get('/users',authenticateToken,userController.getAllUsers);
router.get('/users/:id',authenticateToken,validateUserId, userController.getUserById);
router.post('/users', validateUserCreate, userController.addUser);
router.put('/users/:id',authenticateToken,validateUserUpdate, userController.updateUser);
router.patch('/users/:id',authenticateToken,validateUserUpdate, userController.updateUser);
router.delete('/users/:id',authenticateToken, validateUserId, userController.deleteUser);
router.get('/users/:id/todos',authenticateToken,validateUserId, userController.getAllToDosOfUser);
router.get('/users/:id/todos/:toDoId',authenticateToken,validateUserIdAndToDoIdParams,  userController.getToDoByUserIdAndToDoId);  

export default router;
import express from 'express';
import * as userController from '../controllers/userController';

// Create a router
const router = express.Router();

// Add routes to the router
router.get('/users', userController.getAllUsers);
router.get('/users/:id', userController.getUserById);
router.post('/users', userController.addUser);
router.put('/users/:id', userController.updateUser);
router.patch('/users/:id', userController.updateUser);
router.delete('/users/:id', userController.deleteUser);
router.get('/users/:id/todos', userController.getAllToDosOfUser);
router.get('/users/:userId/todos/:id', userController.getToDoByUserIdAndToDoId);

export default router;
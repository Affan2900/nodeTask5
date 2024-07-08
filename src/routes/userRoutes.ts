import express from 'express';
import * as userController from '../controllers/userController';
import { validateUserCreate, validateUserUpdate, validateUserGetById, validateUserDeleteById, validateUserIdAndToDoIdParams } from '../middleware';

// Create a router
const router = express.Router();

// Add routes to the router
router.get('/users', userController.getAllUsers);
router.get('/users/:id',validateUserGetById, userController.getUserById);
router.post('/users', validateUserCreate, userController.addUser);
router.put('/users/:id',validateUserUpdate, userController.updateUser);
router.patch('/users/:id',validateUserUpdate, userController.updateUser);
router.delete('/users/:id',validateUserDeleteById, userController.deleteUser);
router.get('/users/:id/todos',validateUserGetById, userController.getAllToDosOfUser);
router.get('/users/:userId/todos/:id',validateUserIdAndToDoIdParams, userController.getToDoByUserIdAndToDoId);

export default router;
import express from 'express';
import * as userController from '../controllers/userController';
import { upload, handleProfilePictureUrl } from '../middleware';
import { validateUserCreate, validateUserUpdate,validateUserIdAndToDoIdParams,validateUserId, authenticateToken } from '../middleware';
import * as authService from '../services/authService';
import { RequestHandler } from 'express';


// Create a router
const router = express.Router();

// Add routes to the router
router.get('/users/login',authService.loginUser)
router.get('/users',userController.getAllUsers);
router.get('/users/:id',validateUserId, userController.getUserById);
router.post('/users', validateUserCreate,handleProfilePictureUrl,upload.single('profilePictureUrl'), authService.registerUser as RequestHandler);
router.put('/users/:id',validateUserUpdate,handleProfilePictureUrl, upload.single('profilePicture'), userController.updateUser as RequestHandler);
router.patch('/users/:id',validateUserUpdate,handleProfilePictureUrl, upload.single('profilePicture'), userController.updateUser as RequestHandler);
router.delete('/users/:id', validateUserId, userController.deleteUser);
router.get('/users/:id/todos',validateUserId, userController.getAllToDosOfUser);
router.get('/users/:id/todos/:toDoId',validateUserIdAndToDoIdParams,  userController.getToDoByUserIdAndToDoId);  
//n
export default router;
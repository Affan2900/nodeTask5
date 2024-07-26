import express from 'express';
import * as toDoController from '../controllers/toDoController';
import { validateToDoById,validateTodoCreate, validateTodoUpdate, authenticateToken} from '../middleware';

// Create a router
const router = express.Router();

// Add routes to the router
router.get('/todos',authenticateToken, toDoController.getAllToDos);
router.get('/todos/:id',authenticateToken,validateToDoById, toDoController.getToDoById);
router.post('/todos',authenticateToken, validateTodoCreate, toDoController.addToDo);
router.put('/todos/:id',authenticateToken, validateTodoUpdate, toDoController.updateToDo);
router.patch('/todos/:id',authenticateToken, validateTodoUpdate, toDoController.updateToDo);
router.delete('/todos/:id',authenticateToken, validateToDoById, toDoController.deleteToDo);

export default router;
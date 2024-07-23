import express from 'express';
import * as toDoController from '../controllers/toDoController';
import { validateToDoById,validateTodoCreate, validateTodoUpdate} from '../middleware';

// Create a router
const router = express.Router();

// Add routes to the router
router.get('/todos', toDoController.getAllToDos);
router.get('/todos/:id',validateToDoById, toDoController.getToDoById);
router.post('/todos',validateTodoCreate, toDoController.addToDo);
router.put('/todos/:id',validateTodoUpdate, toDoController.updateToDo);
router.patch('/todos/:id',validateTodoUpdate, toDoController.updateToDo);
router.delete('/todos/:id',validateToDoById, toDoController.deleteToDo);

export default router;
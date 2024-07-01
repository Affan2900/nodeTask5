import express from 'express';
import * as toDoController from '../controllers/toDoController';

// Create a router
const router = express.Router();

// Add routes to the router
router.get('/todos', toDoController.getAllToDos);
router.get('/todos/:id', toDoController.getToDoById);
router.post('/todos', toDoController.addToDo);
router.put('/todos/:id', toDoController.updateToDo);
router.patch('/todos/:id', toDoController.updateToDo);
router.delete('/todos/:id', toDoController.deleteToDo);

export default router;
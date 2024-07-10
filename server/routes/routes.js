import express from "express";
import { getTasks, postTask, updateTask, updateStatus, deleteTask } from '../controllers/taskController.js';

const router = express.Router();

router.get('/tasks', getTasks);
router.post('/task', postTask);
router.put('/task_update/:id', updateTask);
router.put('/task/:taskId', updateStatus);
router.delete('/tasks/:id', deleteTask);

export default router;
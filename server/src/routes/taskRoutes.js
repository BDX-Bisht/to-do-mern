import { Router } from 'express';
import {
  createTask,
  deleteTask,
  getTasks,
  getWeeklySummary,
  searchTasks,
  updateTask,
} from '../controllers/taskController.js';

const router = Router();

router.get('/weeks', getWeeklySummary);
router.get('/search', searchTasks);
router.get('/', getTasks);
router.post('/', createTask);
router.patch('/:id', updateTask);
router.delete('/:id', deleteTask);

export default router;


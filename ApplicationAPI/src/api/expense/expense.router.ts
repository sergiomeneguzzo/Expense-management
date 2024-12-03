import { Router } from 'express';
import {
  createExpense,
  getExpenses,
  updateExpense,
  deleteExpense,
} from './expense.controller';
import { isAuthenticated } from '../../utils/auth/authenticated-middleware';

const router = Router();

router.get('/', isAuthenticated, getExpenses);
router.post('/', isAuthenticated, createExpense);
router.put('/:id', isAuthenticated, updateExpense);
router.delete('/:id', isAuthenticated, deleteExpense);

export default router;

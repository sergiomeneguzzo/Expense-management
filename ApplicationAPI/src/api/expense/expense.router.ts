import { Router } from 'express';
import {
  createExpense,
  getExpenses,
  updateExpense,
  deleteExpense,
} from './expense.controller';
import { isAuthenticated } from '../../utils/auth/authenticated-middleware';
import { CreateExpenseDTO, UpdateExpenseDTO } from './expense.dto';
import { validate } from '../../utils/validation-middleware';

const router = Router();

router.get('/', isAuthenticated, getExpenses);
router.post('/', isAuthenticated, validate(CreateExpenseDTO), createExpense);
router.put('/:id', isAuthenticated, validate(UpdateExpenseDTO), updateExpense);
router.delete('/:id', isAuthenticated, deleteExpense);

export default router;

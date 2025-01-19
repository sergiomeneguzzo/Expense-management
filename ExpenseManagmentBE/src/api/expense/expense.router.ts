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

router.use(isAuthenticated);
router.get('/', getExpenses);
router.post('/', validate(CreateExpenseDTO), createExpense);
router.patch('/:id', validate(UpdateExpenseDTO), updateExpense);
router.delete('/:id', deleteExpense);

export default router;

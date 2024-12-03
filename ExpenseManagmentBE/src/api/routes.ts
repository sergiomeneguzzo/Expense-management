import { Router } from 'express';
import userRouter from './user/user.router';
import authRouter from './auth/auth.router';
import expenseRouter from './expense/expense.router';
import categoryRouter from './category/category.router';

const router = Router();

router.use('/users', userRouter);
router.use('/expenses', expenseRouter);
router.use('/categories', categoryRouter);
router.use(authRouter);

export default router;

import { Request, Response, NextFunction } from 'express';
import expenseService from './expense.service';
import { Expense } from './expense.entity';
import logService from '../services/logs/log.service';

export const getExpenses = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user || !req.user.id) {
      throw new Error('User ID is required');
    }

    const userId: string = req.user.id;
    const expenses = await expenseService.getAllExpenses(userId);

    logService.add(`Fetched expenses for user ID: ${userId}`, true);
    res.json(expenses);
  } catch (error) {
    logService.add(
      `Error fetching expenses: ${(error as Error).message}`,
      false,
    );
    next(error);
  }
};

export const createExpense = async (
  req: Request<
    {},
    {},
    { amount: number; category: string; description?: string; date?: string }
  >,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user || !req.user.id) {
      throw new Error('User ID is required');
    }

    const userId: string = req.user.id;
    const { amount, category, description, date } = req.body;
    const expenseData = {
      userId,
      amount,
      category,
      description,
      date: date ? new Date(date) : new Date(),
    };

    const newExpense = await expenseService.createExpense(expenseData);

    logService.add(
      `Created new expense for user ID: ${userId}, Amount: ${amount}, Category: ${category}`,
      true,
    );
    res.status(201).json(newExpense);
  } catch (error) {
    logService.add(
      `Error fetching expenses: ${(error as Error).message}`,
      false,
    );
    next(error);
  }
};

export const updateExpense = async (
  req: Request<{ id: string }, {}, Partial<Expense>>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const expenseId = req.params.id;

    if (!expenseId) {
      throw new Error('Expense ID is required');
    }

    const updatedExpense = await expenseService.updateExpense(
      expenseId,
      req.body,
    );

    logService.add(`Updated expense ID: ${expenseId}`, true);
    res.json(updatedExpense);
  } catch (error) {
    logService.add(
      `Error fetching expenses: ${(error as Error).message}`,
      false,
    );
    next(error);
  }
};

export const deleteExpense = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const expenseId = req.params.id;

    if (!expenseId) {
      throw new Error('Expense ID is required');
    }

    await expenseService.deleteExpense(expenseId);

    logService.add(`Deleted expense ID: ${expenseId}`, true);
    res.status(204).send();
  } catch (error) {
    logService.add(
      `Error fetching expenses: ${(error as Error).message}`,
      false,
    );
    next(error);
  }
};

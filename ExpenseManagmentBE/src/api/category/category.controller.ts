import { Request, Response, NextFunction } from 'express';
import categoryService from './category.service';

export const getCategories = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const categories = await categoryService.getAllCategories();
    res.json(categories);
  } catch (error) {
    next(error);
  }
};

export const createCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const newCategory = await categoryService.createCategory(req.body);
    res.status(201).json(newCategory);
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const updatedCategory = await categoryService.updateCategory(
      req.params.id,
      req.body,
    );
    res.json(updatedCategory);
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await categoryService.deleteCategory(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

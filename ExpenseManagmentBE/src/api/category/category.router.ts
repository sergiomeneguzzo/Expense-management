import { Router } from 'express';
import {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
} from './category.controller';
import { isAuthenticated } from '../../utils/auth/authenticated-middleware';

const router = Router();

router.use(isAuthenticated);
router.get('/', getCategories);
router.post('/', createCategory);
router.patch('/:id', updateCategory);
router.delete('/:id', deleteCategory);

export default router;

import { CategoryModel } from './category.model';
import { Category } from './category.entity';

const getAllCategories = async () => {
  return CategoryModel.find().sort({ name: 1 });
};

const createCategory = async (category: Category) => {
  return CategoryModel.create(category);
};

const updateCategory = async (
  id: string,
  updatedCategory: Partial<Category>,
) => {
  return CategoryModel.findByIdAndUpdate(id, updatedCategory, { new: true });
};

const deleteCategory = async (id: string) => {
  return CategoryModel.findByIdAndDelete(id);
};

export default {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};

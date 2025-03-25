import express from 'express';
import * as BlogCategoryController from './blogCategory.controller';
import { checkApiKey } from '../../middleware/checkApiKey';

const router = express.Router();

router
  .route('/')
  .post(checkApiKey, BlogCategoryController.createBlogCategory)
  .get(BlogCategoryController.getBlogCategories);

router
  .route('/:id')
  .get(checkApiKey, BlogCategoryController.getBlogCategoriesById)
  .delete(checkApiKey, BlogCategoryController.deleteBlogCategory)
  .patch(checkApiKey, BlogCategoryController.updateBlogCategory);

export default router;

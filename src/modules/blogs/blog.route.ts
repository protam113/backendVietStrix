import express from 'express';
import * as BlogController from './blog.controller';
import { checkApiKey } from '../../middleware/checkApiKey';
import upload from '../../config/formData';

const router = express.Router();

router
  .route('/')
  .post(checkApiKey, upload.none(), BlogController.createBlogData)
  .get(checkApiKey, BlogController.getBlogs);

router.route('/:slug').get(checkApiKey, BlogController.getBlogDataBySlug);

router.route('/:id').delete(checkApiKey, BlogController.deleteBlog);

export default router;

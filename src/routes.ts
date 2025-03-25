import { Router } from 'express';
import docCategoryRoutes from './modules/documentCategories/documentCategory.route';
import documentRoutes from './modules/documents/document.route';
import contactRoutes from './modules/contact/contact.route';
import blogCategoryRoutes from './modules/blogCategories/blogCategory.route';
import blogRoutes from './modules/blogs/blog.route';

const router = Router();

router.use('/docCategory', docCategoryRoutes);
router.use('/document', documentRoutes);
router.use('/contact', contactRoutes);
router.use('/blogCategory', blogCategoryRoutes);
router.use('/blog', blogRoutes);

export default router;

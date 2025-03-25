import { Request, Response } from 'express';
import { BlogService } from './blog.service';
import { AppError } from '../../helpers/AppError';

let bLogService = new BlogService(); // Biến toàn cục để lưu service instance

export const setContactService = (service: BlogService) => {
  bLogService = service; // Cho phép thay thế service khi test
};

export const createBlogData = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const newBlog = await bLogService.createBlog(req.body);
    res.status(201).json({
      message: 'blog created successfully',
      data: newBlog,
    });
  } catch (error) {
    console.error(
      'Error creating blog:',
      error instanceof Error ? error.stack : error
    );

    // Handle AppError with its status code
    if (error instanceof AppError) {
      res.status(error.statusCode).json({
        message: error.message,
      });
      return; // Add return statement without a value
    }

    // For other errors
    res.status(500).json({
      message: 'Internal Server Error',
    });
  }
};

export const getBlogs = async (req: Request, res: Response) => {
  try {
    const result = await bLogService.getBlogs(req.query);
    res.status(200).json(result);
  } catch (error) {
    console.error(
      'Error fetching blog:',
      error instanceof Error ? error.stack : error
    );
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getBlogDataBySlug = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const contact = await bLogService.getBlogBySlug(req.params.slug);
    if (!contact) {
      res.status(404).json({ message: 'blog not found' });
      return; // Đảm bảo kết thúc hàm
    }
    res.status(200).json({ data: contact });
  } catch (error) {
    console.error('Error fetching blog by slug:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const deleteBlog = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const deletedBlog = await bLogService.deleteBlog(req.params.id);
    if (!deletedBlog) {
      res.status(404).json({ message: 'blog not found' });
      return;
    }
    res.status(200).json({ message: 'blog deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

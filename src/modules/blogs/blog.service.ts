import { BlogRepository } from './blog.repository';
import { AppError } from '../../helpers/AppError';
import slugify from 'slugify';
import mongoose from 'mongoose';

export class BlogService {
  private blogRepo: BlogRepository;

  constructor(contactRepo?: BlogRepository) {
    this.blogRepo = contactRepo || new BlogRepository();
  }

  async createBlog(data: any) {
    try {
      // Kiểm tra nếu không có slug thì tự động tạo slug từ title
      if (!data.slug) {
        data.slug = slugify(data.title, { lower: true, strict: true }); // Tạo slug từ title
      }

      // Kiểm tra xem slug đã tồn tại trong blog collection chưa
      const existingblog = await this.blogRepo.findOne({ slug: data.slug });
      if (existingblog) {
        throw new AppError('blog slug already exists', 400);
      }

      // Kiểm tra xem category có tồn tại trong blogCategory collection không
      const blogCategoryRepo = mongoose.model('BlogCategory');
      const categoryExists = await blogCategoryRepo.findById(data.category);

      if (!categoryExists) {
        throw new AppError('Category not found', 404);
      }

      // Nếu mọi thứ hợp lệ, tạo blog mới
      return await this.blogRepo.create({ ...data });
    } catch (error: any) {
      console.error('MONGO ERROR:', error);

      // Kiểm tra lỗi trùng lặp key (MongoDB error code 11000)
      if (error.code === 11000) {
        throw new AppError('Slug already exists', 400);
      }

      // Nếu đã xử lý lỗi cụ thể (như AppError), ném lại lỗi đó
      if (error instanceof AppError) {
        throw error;
      }

      // Nếu không phải lỗi trùng lặp hoặc AppError, ném lỗi 500 với thông báo chi tiết
      throw new AppError(
        `Failed to create blog: ${error.message || error}`,
        500
      );
    }
  }

  async getBlogs(query: any) {
    const { status, page = '1', limit = '10' } = query;

    const filter: any = status ? { status } : {};
    const pageNumber = Math.max(Number(page), 1);
    const limitNumber = Math.max(Number(limit), 1);
    const skip = (pageNumber - 1) * limitNumber;

    // First, update your blogRepo.findAll method to include populate:
    // This assumes you've modified the findAll method in your repository
    const [result, totalContacts] = await Promise.all([
      this.blogRepo.findAll(filter, skip, limitNumber), // This should have populate inside
      this.blogRepo.count(filter),
    ]);

    return {
      result,
      pagination: {
        currentPage: pageNumber,
        totalPages: Math.ceil(totalContacts / limitNumber),
        totalItems: totalContacts,
        itemsPerPage: limitNumber,
      },
    };
  }
  async getBlogBySlug(slug: string) {
    return this.blogRepo.findBySlug(slug);
  }

  async deleteBlog(_id: string) {
    return this.blogRepo.delete(_id);
  }
}

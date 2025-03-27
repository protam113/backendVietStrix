// blogCategory.repository.ts

import BlogCategory from './blogCategory.model';
import { AppError, ErrorType } from '../../helpers/AppError';
import { IBlogCategoryForm } from './blogCategory.interface';

export class BlogCategoryRepository {
  // Hàm chung để xử lý lỗi
  private handleError(action: string, error: any): never {
    console.error(`${action} failed:`, error);

    if (error.code === 11000) {
      throw AppError.conflict('Blog category already exists.', {
        action,
        duplicateKey: error.keyValue,
        errorCode: 'DUPLICATE_BLOG_CATEGORY',
      });
    }

    if (error instanceof AppError) {
      throw error;
    }

    throw AppError.create(`${action} failed: ${error.message || error}`, {
      type: ErrorType.INTERNAL_SERVER,
      context: {
        action,
        originalError: error.toString(),
      },
    });
  }

  // Tạo blogCategory
  async create(blogCategory: IBlogCategoryForm): Promise<IBlogCategoryForm> {
    try {
      // Kiểm tra tính hợp lệ của dữ liệu (optional)
      // Sử dụng AppError mới
      if (!blogCategory.name || !blogCategory.slug) {
        throw AppError.badRequest('Name and slug are required.', {
          missingFields: {
            ...(blogCategory.name ? {} : { name: 'Name is missing' }),
            ...(blogCategory.slug ? {} : { slug: 'Slug is missing' }),
          },
        });
      }

      // Thực hiện một số xử lý trước khi lưu, như chuẩn hóa slug
      blogCategory.slug = blogCategory.slug.trim().toLowerCase();

      // Kiểm tra xem slug có tồn tại trong cơ sở dữ liệu không
      const existingCategory = await BlogCategory.findOne({
        slug: blogCategory.slug,
      });
      if (existingCategory) {
        throw AppError.conflict('Blog category already exists.', {
          existingCategory: {
            id: existingCategory._id,
            name: existingCategory.name,
            slug: existingCategory.slug,
          },
        });
      }

      // Tạo mới danh mục blog
      return await BlogCategory.create(blogCategory);
    } catch (error) {
      this.handleError('Creating blog category', error);
      return undefined as any;
    }
  }

  // Tìm một blogCategory theo query
  async findOne(query: Record<string, any>): Promise<IBlogCategoryForm | null> {
    try {
      return await BlogCategory.findOne(query);
    } catch (error) {
      this.handleError('Finding blog category', error);
      return null; // Nếu không tìm thấy sẽ trả về null
    }
  }

  // Lấy tất cả blogCategory với phân trang
  async findAll(
    filter: Record<string, any>,
    skip: number,
    limit: number
  ): Promise<IBlogCategoryForm[]> {
    try {
      return await BlogCategory.find(filter).skip(skip).limit(limit).lean(); // Đảm bảo trả về dữ liệu thuần (lean)
    } catch (error) {
      this.handleError('Finding blog categories', error);
      return []; // Nếu có lỗi, trả về một mảng rỗng
    }
  }

  // Đếm số lượng blogCategory
  async count(filter: Record<string, any>): Promise<number> {
    try {
      return await BlogCategory.countDocuments(filter);
    } catch (error) {
      this.handleError('Counting blog categories', error);
      return 0; // Nếu có lỗi, trả về 0
    }
  }

  // Tìm blogCategory theo ID
  async findById(_id: string): Promise<IBlogCategoryForm | null> {
    try {
      return await BlogCategory.findById(_id);
    } catch (error) {
      this.handleError('Finding blog category by ID', error);
      return null; // Nếu không tìm thấy sẽ trả về null
    }
  }

  // Cập nhật blogCategory
  async update(
    _id: string,
    name: string,
    slug: string
  ): Promise<IBlogCategoryForm | null> {
    try {
      return await BlogCategory.findByIdAndUpdate(
        _id,
        { name, slug },
        { new: true, runValidators: true }
      );
    } catch (error) {
      this.handleError('Updating blog category', error);
      return null; // Nếu không cập nhật được, trả về null
    }
  }

  // Xóa blogCategory
  async delete(_id: string): Promise<IBlogCategoryForm | null> {
    try {
      return await BlogCategory.findByIdAndDelete(_id);
    } catch (error) {
      this.handleError('Deleting blog category', error);
      return null; // Nếu không xóa được, trả về null
    }
  }
}

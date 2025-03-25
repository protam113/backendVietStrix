import DocumentCategory from './documentCategory.model';
import { AppError } from '../../helpers/AppError';

export class DocumentCategoryRepository {
  // Hàm chung để xử lý lỗi
  private handleError(action: string, error: any) {
    console.error(`${action} failed:`, error);
    if (error.code === 11000) {
      throw new AppError('Document category already exists.', 400); // Trường hợp lỗi trùng lặp
    }
    throw new AppError(`${action} failed: ${error.message || error}`, 500); // Các lỗi khác
  }

  // Tạo documentCategory
  async create(documentCategory: any) {
    try {
      return await DocumentCategory.create(documentCategory);
    } catch (error) {
      this.handleError('Creating document category', error);
    }
  }

  // Tìm một documentCategory theo query
  async findOne(query: any) {
    try {
      return await DocumentCategory.findOne(query);
    } catch (error) {
      this.handleError('Finding document category', error);
    }
  }

  // Lấy tất cả document categories với phân trang
  async findAll(filter: Record<string, any>, skip: number, limit: number) {
    try {
      return await DocumentCategory.find(filter).skip(skip).limit(limit).lean();
    } catch (error) {
      this.handleError('Finding document categories', error);
    }
  }

  // Đếm số lượng document categories
  async count(filter: Record<string, any>) {
    try {
      return await DocumentCategory.countDocuments(filter);
    } catch (error) {
      this.handleError('Counting document categories', error);
    }
  }

  // Tìm documentCategory theo ID
  async findById(_id: string) {
    try {
      return await DocumentCategory.findById(_id);
    } catch (error) {
      this.handleError('Finding document category by ID', error);
    }
  }

  // Cập nhật documentCategory
  async updateDocumentCategory(_id: string, name: string, slug: string) {
    try {
      return await DocumentCategory.findByIdAndUpdate(
        _id,
        { name, slug },
        { new: true, runValidators: true }
      );
    } catch (error) {
      this.handleError('Updating document category', error);
    }
  }

  // Xóa documentCategory
  async delete(_id: string) {
    try {
      return await DocumentCategory.findByIdAndDelete(_id);
    } catch (error) {
      this.handleError('Deleting document category', error);
    }
  }
}

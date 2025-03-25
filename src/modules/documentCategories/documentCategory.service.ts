import { DocumentCategoryRepository } from './documentCategory.repository';
import { AppError } from '../../helpers/AppError';

export class DocumentCategoryService {
  private contactRepo: DocumentCategoryRepository;

  constructor() {
    this.contactRepo = new DocumentCategoryRepository();
  }

  async createDocumentCategory(data: any) {
    try {
      const existingCategory = await this.contactRepo.findOne({
        slug: data.slug,
      });
      if (existingCategory) {
        throw new AppError('Slug already exists', 400); // Trả về lỗi trùng lặp nếu tìm thấy category có slug giống
      }

      return await this.contactRepo.create({ ...data });
    } catch (error: any) {
      console.error('MONGO ERROR:', error); // In ra lỗi chi tiết để kiểm tra

      // Kiểm tra lỗi trùng lặp key (MongoDB error code 11000)
      if (error.code === 11000) {
        throw new AppError('Slug already exists', 400);
      }

      // Nếu không phải lỗi trùng lặp, ném lỗi 500 với thông báo chi tiết
      throw new AppError(
        `Failed to create document category: ${error.message || error}`,
        500
      );
    }
  }

  async getDocumentCategory(query: any) {
    const { page = '1', limit = '10' } = query;
    const filter: any = {};

    const pageNumber = Math.max(parseInt(page as string, 10), 1);
    const limitNumber = Math.max(parseInt(limit as string, 10), 1);
    const skip = (pageNumber - 1) * limitNumber;

    const result = await this.contactRepo.findAll(filter, skip, limitNumber);

    // Kiểm tra nếu totalDocumentCategory là undefined và gán giá trị mặc định 0
    const totalDocumentCategory = (await this.contactRepo.count(filter)) || 0;

    return {
      result,
      pagination: {
        currentPage: pageNumber,
        totalPages: Math.ceil(totalDocumentCategory / limitNumber),
        totalItems: totalDocumentCategory,
        itemsPerPage: limitNumber,
      },
    };
  }

  async getDocumentCategoryById(_id: string) {
    return await this.contactRepo.findById(_id);
  }

  async updateDocumentCategoryID(_id: string, name: string, slug: string) {
    if (!name || !slug) {
      throw new Error('Name and slug are required');
    }
    return this.contactRepo.updateDocumentCategory(_id, name, slug);
  }

  async deleteDocumentCategory(_id: string) {
    return await this.contactRepo.delete(_id);
  }
}

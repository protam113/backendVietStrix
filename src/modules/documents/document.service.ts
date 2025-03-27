import { DocumentRepository } from './document.repository';
import { AppError } from '../../helpers/AppError';
import slugify from 'slugify';
import mongoose from 'mongoose';

export class DocumentService {
  private documentRepo: DocumentRepository;

  constructor(contactRepo?: DocumentRepository) {
    this.documentRepo = contactRepo || new DocumentRepository();
  }

  async createDocument(data: any) {
    try {
      // Kiểm tra nếu không có slug thì tự động tạo slug từ title
      if (!data.slug) {
        data.slug = slugify(data.title, { lower: true, strict: true }); // Tạo slug từ title
      }

      // Kiểm tra xem slug đã tồn tại trong Document collection chưa
      const existingDocument = await this.documentRepo.findOne({
        slug: data.slug,
      });
      if (existingDocument) {
        throw AppError.conflict('Document slug already exists');
      }

      // Kiểm tra xem category có tồn tại trong DocumentCategory collection không
      const documentCategoryRepo = mongoose.model('DocumentCategory');
      const categoryExists = await documentCategoryRepo.findById(data.category);

      if (!categoryExists) {
        throw AppError.notFound('Category not found');
      }

      // Nếu mọi thứ hợp lệ, tạo document mới
      return await this.documentRepo.create({ ...data });
    } catch (error: any) {
      console.error('MONGO ERROR:', error);

      // Kiểm tra lỗi trùng lặp key (MongoDB error code 11000)
      if (error.code === 11000) {
        throw AppError.conflict('Slug already exists');
      }

      // Nếu đã xử lý lỗi cụ thể (như AppError), ném lại lỗi đó
      if (error instanceof AppError) {
        throw error;
      }

      // Nếu không phải lỗi trùng lặp hoặc AppError, ném lỗi 500 với thông báo chi tiết
      throw AppError.create(
        `Failed to create document: ${error.message || error}`,
        {
          statusCode: 500,
        }
      );
    }
  }

  async getDocuments(query: any) {
    const { status, page = '1', limit = '10' } = query;

    const filter: any = status ? { status } : {};
    const pageNumber = Math.max(Number(page), 1);
    const limitNumber = Math.max(Number(limit), 1);
    const skip = (pageNumber - 1) * limitNumber;

    // First, update your documentRepo.findAll method to include populate:
    // This assumes you've modified the findAll method in your repository
    const [result, totalContacts] = await Promise.all([
      this.documentRepo.findAll(filter, skip, limitNumber), // This should have populate inside
      this.documentRepo.count(filter),
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
  async getDocumentBySlug(slug: string) {
    return this.documentRepo.findBySlug(slug);
  }

  async deleteContact(_id: string) {
    return this.documentRepo.delete(_id);
  }
}

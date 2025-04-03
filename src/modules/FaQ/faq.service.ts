// FaQ.servcce.ts

import { FaQRepository } from './faq.repository';
import { AppError, ErrorType } from '../../helpers/AppError';

export class FaQService {
  private faqRepo: FaQRepository;

  constructor() {
    this.faqRepo = new FaQRepository();
  }

  async createFaQ(data: any) {
    try {
      // Kiểm tra câu hỏi đã tồn tại (không phân biệt hoa thường, xóa khoảng trắng)
      const existingFaQ = await this.faqRepo.findOne({
        question: { $regex: new RegExp(`^${data.question.trim()}$`, 'i') },
      });

      if (existingFaQ) {
        throw AppError.conflict('Question already exists', {
          existingQuestion: existingFaQ.question,
          existingFaQId: existingFaQ._id,
        });
      }

      // Tạo mới  FAQ
      return await this.faqRepo.create({ ...data });
    } catch (error: any) {
      console.error('MONGO ERROR:', error);

      if (error.code === 11000) {
        throw AppError.conflict('Question already exists', {
          duplicateKey: error.keyValue,
        });
      }

      throw AppError.create(`Failed to create FaQ: ${error.message || error}`, {
        type: ErrorType.INTERNAL_SERVER,
        context: { originalError: error.toString() },
      });
    }
  }

  async getFaQ(query: any) {
    const { page = '1', limit = '10', status } = query;
    let filter: any = {};

    const pageNumber = Math.max(parseInt(page as string, 10), 1);
    const limitNumber = Math.max(parseInt(limit as string, 10), 1);
    const skip = (pageNumber - 1) * limitNumber;

    // Nếu có status, lọc theo giá trị 'show' hoặc 'hide'
    if (status && ['show', 'hide'].includes(status)) {
      filter.status = status;
    }

    // Lấy danh mục FAQ theo filter
    const result = await this.faqRepo.findAll(filter, skip, limitNumber);

    // Lấy tổng số FAQ theo filter
    const totalFaq = (await this.faqRepo.count(filter)) || 0;

    return {
      result,
      pagination: {
        currentPage: pageNumber,
        totalPages: Math.ceil(totalFaq / limitNumber),
        totalItems: totalFaq,
        itemsPerPage: limitNumber,
      },
    };
  }

  async updateFaQID(_id: string, name: string, slug: string) {
    if (!name || !slug) {
      throw new Error('Name and slug are required');
    }
    return this.faqRepo.update(_id, name, slug);
  }

  async deleteFaQ(_id: string) {
    return await this.faqRepo.delete(_id);
  }
}

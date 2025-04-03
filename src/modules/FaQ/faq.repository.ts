// FaQ.repository.ts

import FaQ from './faq.model';
import { AppError, ErrorType } from '../../helpers/AppError';
import { IFaq } from './faq.interface';

export class FaQRepository {
  // Hàm chung để xử lý lỗi
  private handleError(action: string, error: any): never {
    console.error(`${action} failed:`, error);

    if (error.code === 11000) {
      throw AppError.conflict('FaQ already exists.', {
        action,
        duplicateKey: error.keyValue,
        errorCode: 'DUPLICATE_FAQ',
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

  // Tạo FaQ
  async create(FaQData: any) {
    try {
      return await FaQ.create(FaQData);
    } catch (error) {
      throw new Error(`Error creating FaQ: ${error}`);
    }
  }
  // Tìm một FaQ theo query
  async findOne(query: Record<string, any>): Promise<IFaq | null> {
    try {
      return await FaQ.findOne(query);
    } catch (error) {
      this.handleError('Finding FaQ', error);
      return null;
    }
  }

  // Lấy tất cả FaQ với phân trang
  async findAll(
    filter: Record<string, any>,
    skip: number,
    limit: number
  ): Promise<IFaq[]> {
    try {
      return await FaQ.find(filter).skip(skip).limit(limit).lean(); // Đảm bảo trả về dữ liệu thuần (lean)
    } catch (error) {
      this.handleError('Finding FaQ', error);
      return []; // Nếu có lỗi, trả về một mảng rỗng
    }
  }

  // Đếm số lượng FaQ
  async count(filter: Record<string, any>): Promise<number> {
    try {
      return await FaQ.countDocuments(filter);
    } catch (error) {
      this.handleError('Counting FaQ', error);
      return 0; // Nếu có lỗi, trả về 0
    }
  }

  // Cập nhật FaQ
  async update(
    _id: string,
    answer: string,
    question: string
  ): Promise<IFaq | null> {
    try {
      return await FaQ.findByIdAndUpdate(
        _id,
        { answer, question },
        { new: true, runValidators: true }
      );
    } catch (error) {
      this.handleError('Updating FaQ', error);
      return null; // Nếu không cập nhật được, trả về null
    }
  }

  // Xóa FaQ
  async delete(_id: string): Promise<IFaq | null> {
    try {
      return await FaQ.findByIdAndDelete(_id);
    } catch (error) {
      this.handleError('Deleting FaQ', error);
      return null;
    }
  }
}

import Document from './document.model';
import { AppError } from '../../helpers/AppError';

export class DocumentRepository {
  private handleError(action: string, error: any) {
    console.error(`${action} failed:`, error);
    if (error.code === 11000) {
      throw new AppError('Document  already exists.', 400);
    }
    throw new AppError(`${action} failed: ${error.message || error}`, 500);
  }

  async create(documentData: any) {
    try {
      return await Document.create(documentData);
    } catch (error) {
      throw new Error(`Error creating document: ${error}`);
    }
  }

  async findAll(filter: Record<string, any>, skip: number, limit: number) {
    try {
      // The correct path to populate is 'category', not 'DocumentCategory'
      return await Document.find(filter)
        .populate('category', 'name slug ') // Use 'category' which is the field name in your schema
        .skip(skip)
        .limit(limit);
    } catch (error) {
      throw new Error(`Error finding document: ${error}`);
    }
  }

  async findOne(query: any) {
    try {
      return await Document.findOne(query);
    } catch (error) {
      this.handleError('Finding document category', error);
    }
  }

  async count(filter: Record<string, any>) {
    try {
      return await Document.countDocuments(filter);
    } catch (error) {
      throw new Error(`Error counting document: ${error}`);
    }
  }

  async findBySlug(slug: string) {
    try {
      return await Document.findOne({ slug: slug }); // Tìm tài liệu theo slug
    } catch (error) {
      throw new Error(`Error finding document by slug: ${error}`);
    }
  }

  async delete(_id: string) {
    try {
      return await Document.findByIdAndDelete(_id);
    } catch (error) {
      throw new Error(`Error deleting document: ${error}`);
    }
  }
}

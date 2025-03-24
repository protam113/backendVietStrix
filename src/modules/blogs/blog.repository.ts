import Blog from "./blog.model";
import { AppError } from "../../helpers/AppError"; 

export class BlogRepository {
  private handleError(action: string, error: any) {
    console.error(`${action} failed:`, error);
    if (error.code === 11000) {
      throw new AppError("Document  already exists.", 400);
    }
    throw new AppError(`${action} failed: ${error.message || error}`, 500); 
  }

  async create(blogData: any) {
    try {
      return await Blog.create(blogData);
    } catch (error) {
      throw new Error(`Error creating Blog: ${error}`);
    }
  }

  async findAll(filter: Record<string, any>, skip: number, limit: number) {
    try {
      // The correct path to populate is 'category', not 'DocumentCategory'
      return await Blog.find(filter)
        .populate("category", "name slug ") // Use 'category' which is the field name in your schema
        .skip(skip)
        .limit(limit);
    } catch (error) {
      throw new Error(`Error finding Blog: ${error}`);
    }
  }

  async findOne(query: any) {
    try {
      return await Blog.findOne(query);
    } catch (error) {
      this.handleError('Finding Blog category', error);
    }
  }


  async count(filter: Record<string, any>) {
    try {
      return await Blog.countDocuments(filter);
    } catch (error) {
      throw new Error(`Error counting Blog: ${error}`);
    }
  }

  async findBySlug(slug: string) {
    try {
      return await Blog.findOne({ slug: slug }); 
    } catch (error) {
      throw new Error(`Error finding Blog by slug: ${error}`);
    }
  }
  

  async delete(_id: string) {
    try {
      return await Blog.findByIdAndDelete(_id);
    } catch (error) {
      throw new Error(`Error deleting Blog: ${error}`);
    }
  }
}

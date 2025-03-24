import { BlogCategoryRepository } from "./blogCategory.repository";
import { AppError } from "../../helpers/AppError"; 

export class BlogCategoryService {
  private contactRepo: BlogCategoryRepository;

  constructor() {
    this.contactRepo = new BlogCategoryRepository();
  }

  async createBlogCategory(data: any) {
    try {
      const existingCategory = await this.contactRepo.findOne({ slug: data.slug });
      if (existingCategory) {
        throw new AppError("Slug already exists", 400); // Trả về lỗi trùng lặp nếu tìm thấy category có slug giống
      }

      if (data.subcategories && data.subcategories.length > 0) {
        // Kiểm tra sự tồn tại của  category con
        const parentCategories = await this.contactRepo.findAll({ _id: { $in: data.subcategories } }, 0, data.subcategories.length);
        if (parentCategories && parentCategories.length !== data.subcategories.length) {
            throw new AppError("Some parent categories do not exist", 400);
          }
      }

      // Tạo mới document category
      return await this.contactRepo.create({ ...data });
    } catch (error: any) {
      console.error("MONGO ERROR:", error); 

      if (error.code === 11000) {
        throw new AppError("Slug already exists", 400);
      }

      throw new AppError(`Failed to create document category: ${error.message || error}`, 500);
    }
  }
  
  async getBlogCategory(query: any) {
    const { page = "1", limit = "10", parentSlug } = query;
    let filter: any = {};
  
    const pageNumber = Math.max(parseInt(page as string, 10), 1);
    const limitNumber = Math.max(parseInt(limit as string, 10), 1);
    const skip = (pageNumber - 1) * limitNumber;

    // Nếu có parentSlug, tìm _id của parent category rồi lọc category con theo subcategories
    if (parentSlug) {
        const parentCategory = await this.contactRepo.findOne({ slug: parentSlug });
        if (!parentCategory) {
            // Nếu không tìm thấy category cha, trả về lỗi 404
            throw new AppError("Parent category not found", 404);
        }
        filter = { subcategories: parentCategory._id }; // Lọc các blog category có subcategories là parentCategory._id
    }

    // Lấy danh mục blog và populate thông tin về subcategories
    const result = await this.contactRepo.findAll(filter, skip, limitNumber);

    // Lấy tổng số blog categories theo filter
    const totalBlogCategory = await this.contactRepo.count(filter) || 0;
  
    return {
        result,
        pagination: {
            currentPage: pageNumber,
            totalPages: Math.ceil(totalBlogCategory / limitNumber),
            totalItems: totalBlogCategory,
            itemsPerPage: limitNumber,
        },
    };
}



  async getBlogCategoryById(_id: string) {
    return await this.contactRepo.findById(_id);
  }


  async updateBlogCategoryID(_id: string, name: string, slug: string) {
    if (!name || !slug) {
      throw new Error("Name and slug are required");
    }
    return this.contactRepo.update(_id, name, slug);
  }
  
  async deleteBLogCategory(_id: string) {
    return await this.contactRepo.delete(_id);
  }
}

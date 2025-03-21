import { Request, Response } from "express";
import Category from "../models/Category";

// Tạo category mới
export const createCategory = async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, slug, subcategories } = req.body;
  
      // Kiểm tra nếu category đã tồn tại (theo slug)
      const existingCategory = await Category.findOne({ slug }).lean();
      if (existingCategory) {
        res.status(400).json({ message: "Category already exists" });
        return;
      }
  
      // Tạo category mới
      const newCategory = new Category({ name, slug, subcategories });
      await newCategory.save();
  
      res.status(201).json(newCategory);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  export const getAllCategories = async (req: Request, res: Response): Promise<void> => {
    try {
      let { page = 1, limit = 10 } = req.query;
  
      // Chuyển đổi sang số nguyên
      const pageNumber = parseInt(page as string, 10);
      const pageSize = parseInt(limit as string, 10);
  
      // Tính số lượng category cần skip
      const skip = (pageNumber - 1) * pageSize;
  
      // Lấy dữ liệu category với pagination
      const categories = await Category.find().skip(skip).limit(pageSize).lean();
  
      // Đếm tổng số categories
      const total = await Category.countDocuments();
  
      res.status(200).json({
        data: categories,
        pagination: {
          page: pageNumber,
          limit: pageSize,
          total,
          totalPages: Math.ceil(total / pageSize),
        },
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

// Lấy 1 category theo ID
export const getOneCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id).lean();
    if (!category) {
      res.status(404).json({ message: "Category not found" });
      return;
    }

    res.status(200).json(category);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

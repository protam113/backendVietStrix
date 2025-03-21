import { Request, Response } from "express";
import Docs from "../models/Docs";
import Category from "../models/Category";
import slugify from "slugify";

export const createDocs = async (req: Request, res: Response): Promise<void> => {
    try {
      const { title, content, description, link, category } = req.body;
  
      // Kiểm tra category có tồn tại không
      const existingCategory = await Category.findById(category);
      if (!existingCategory) {
        res.status(400).json({ message: "Category not found" });
        return;
      }
  
      // Tạo slug từ title
      const slug = slugify(title, { lower: true });
  
      // Kiểm tra slug có trùng không
      const existingDoc = await Docs.findOne({ slug });
      if (existingDoc) {
        res.status(400).json({ message: "Slug already exists" });
        return;
      }
  
      // Tạo Docs mới
      const newDoc = new Docs({ title, slug, content, description, link, category });
      await newDoc.save();
  
      res.status(201).json(newDoc);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };
// 🔥 API lấy danh sách Docs có lọc theo Category + Pagination
export const getAllDocs = async (req: Request, res: Response): Promise<void> => {
    try {
      let { category, page = "1", pageSize = "10" } = req.query;
  
      // Chuyển đổi page & pageSize sang số nguyên
      const pageNum = Math.max(parseInt(page as string), 1);
      const limit = Math.max(parseInt(pageSize as string), 1);
      const skip = (pageNum - 1) * limit;
  
      // 🔥 Lọc theo category nếu có
      let filter = {};
      if (category) filter = { category };
  
      // 🔥 Query MongoDB
      const docs = await Docs.find(filter)
        .populate("category", "name slug subcategories") // Lấy thêm thông tin category
        .skip(skip) // Bỏ qua số lượng docs tương ứng với page trước đó
        .limit(limit); // Giới hạn số docs trả về
  
      // 🔥 Đếm tổng số docs (để tính tổng số page)
      const totalDocs = await Docs.countDocuments(filter);
      const totalPages = Math.ceil(totalDocs / limit);
  
      // ✅ Trả về dữ liệu + metadata pagination
      res.status(200).json({
        data: docs,
        pagination: {
          currentPage: pageNum,
          pageSize: limit,
          totalPages,
          totalDocs,
        },
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

// Lấy 1 Docs
export const getOneDoc = async (req: Request, res: Response): Promise<void> => {
  try {
    const { slug } = req.params; // Đổi từ `id` thành `slug`
    
    const doc = await Docs.findOne({ slug }).populate("category", "name slug subcategories");

    if (!doc) {
      res.status(404).json({ message: "Document not found" });
      return;
    }

    res.status(200).json(doc);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

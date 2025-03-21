import { Request, Response } from "express";
import Blogs from "../models/Blog";
import BlogCategory from "../models/BlogCategory";
import slugify from "slugify";

export const createBlog = async (req: Request, res: Response): Promise<void> => {
    try {
        const { title, content, description, link, categories } = req.body;

        // Kiểm tra danh mục có tồn tại không
        const existingCategories = await BlogCategory.find({ _id: { $in: categories } });
        if (existingCategories.length !== categories.length) {
            res.status(400).json({ message: "One or more categories not found" });
            return;
        }

        // Tạo slug từ title
        const slug = slugify(title, { lower: true });

        // Kiểm tra slug có trùng không
        const existingDoc = await Blogs.findOne({ slug });
        if (existingDoc) {
            res.status(400).json({ message: "Slug already exists" });
            return;
        }

        // Tạo Docs mới
        const newBlog = new Blogs({ title, slug, content, description, link, categories });
        await newBlog.save();

        res.status(201).json(newBlog);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};


export const getAllBlogs = async (req: Request, res: Response): Promise<void> => {
    try {
        let { category, page = "1", pageSize = "10" } = req.query;

        // Chuyển đổi page & pageSize sang số nguyên
        const pageNum = Math.max(parseInt(page as string), 1);
        const limit = Math.max(parseInt(pageSize as string), 1);
        const skip = (pageNum - 1) * limit;

        // Lọc theo categories (có thể lọc nhiều category)
        let filter: any = {};
        if (category) {
            const categoryArray = (category as string).split(","); // Cho phép lọc theo nhiều category
            filter = { categories: { $in: categoryArray } };
        }

        // Query MongoDB
        const blogs = await Blogs.find(filter)
            .populate("categories", "name slug") // Lấy thêm thông tin categories
            .skip(skip)
            .limit(limit);

        // Đếm tổng số docs
        const totalBlogs = await Blogs.countDocuments(filter);
        const totalPages = Math.ceil(totalBlogs / limit);

        // Trả về dữ liệu + metadata pagination
        res.status(200).json({
            data: blogs,
            pagination: {
                currentPage: pageNum,
                pageSize: limit,
                totalPages,
                totalBlogs,
            },
        });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};



export const getOneBlog = async (req: Request, res: Response): Promise<void> => {
    try {
        const { slug } = req.params;

        // Tìm blog theo slug và populate thông tin category
        const blog = await Blogs.findOne({ slug })
            .populate("categories", "name slug");

        if (!blog) {
            res.status(404).json({ message: "Blog not found" });
            return;
        }

        res.status(200).json(blog);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

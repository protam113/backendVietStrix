import { Request, Response } from "express";
import BlogCategory from "../models/BlogCategory";

/**
 * ==========================
 * 📌 @HOOK useCreateCategory
 * ==========================
 *
 * @description Custom hook to create a new category.
 *
 * @param {Object} categoryData - The category data to be created.
 * @param {string} categoryData.name - The name of the category.
 * @param {string} categoryData.slug - The unique slug of the category.
 * @param {string | null} categoryData.parentId - (Optional) The ID of the parent category. Null if it's a root category.
 *
 * @returns {Function} mutate - Function to trigger category creation.
 *
 * @usage
 * const { mutate: createCategory, isLoading, isError } = useCreateCategory();
 * createCategory({ name: "JavaScript", slug: "javascript", parentId: "123" });
 *
 * @notes
 * - Creates a new category with an optional parent-child relationship.
 * - If `parentId` is provided, the category is treated as a subcategory.
 * - Automatically updates the category list upon successful creation.
 * - Uses React Query mutation for optimized state management.
 */

export const createCategory = async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, slug, subcategories } = req.body;
  
      // Kiểm tra category đã tồn tại chưa
      const existingCategory = await BlogCategory.findOne({ slug }).lean();
      if (existingCategory) {
        res.status(400).json({ message: "Category already exists" });
        return;
      }

      // Kiểm tra nếu có subcategories, phải đảm bảo chúng tồn tại trong DB
      if (subcategories && subcategories.length > 0) {
        const parentCategories = await BlogCategory.find({ _id: { $in: subcategories } }).lean();
        if (parentCategories.length !== subcategories.length) {
          res.status(400).json({ message: "Some parent categories do not exist" });
          return;
        }
      }

      // Tạo category mới
      const newCategory = new BlogCategory({ name, slug, subcategories });
      await newCategory.save();
  
      res.status(201).json(newCategory);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
};

/**
 * ==========================
 * 📌 @HOOK useCategoryList
 * ==========================
 *
 * @description Custom hook to retrieve a paginated list of categories.
 *
 * @param {number} page - The current page number.
 * @param {number} limit - The number of items per page.
 * @returns {Object} - Contains categories, pagination data, and status flags.
 *
 * @usage
 * const { categories, pagination, isLoading, isError } = useCategoryList(page, limit);
 *
 * @notes
 * - Supports pagination with `page` and `limit` parameters.
 * - Populates subcategories to provide hierarchical structure.
 * - Uses React Query for efficient data fetching and caching.
 * - Allows filtering categories by parent or child via query parameters.
 */
export const getAllCategories = async (req: Request, res: Response): Promise<void> => {
    try {
        let { page = 1, limit = 10, parentSlug } = req.query;

        const pageNumber = parseInt(page as string, 10);
        const pageSize = parseInt(limit as string, 10);
        const skip = (pageNumber - 1) * pageSize;

        let filter = {};

        // 🔥 Nếu có `parentSlug`, tìm _id của cha trước, rồi lọc danh mục con
        if (parentSlug) {
            const parentCategory = await BlogCategory.findOne({ slug: parentSlug }).lean();
            if (!parentCategory) {
                res.status(404).json({ message: "Parent category not found" });
                return;
            }
            filter = { subcategories: parentCategory._id };
        }

        // Lấy danh mục + populate subcategories (chỉ lấy name, slug)
        const categories = await BlogCategory.find(filter)
            .populate("subcategories", "name slug")
            .skip(skip)
            .limit(pageSize)
            .lean();

        const total = await BlogCategory.countDocuments(filter);

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



/**
 * ==========================
 * 📌 @HOOK useCategoryDetail
 * ==========================
 *
 * @description Custom hook to retrieve details of a specific category.
 *
 * @param {string} slug - The slug of the category.
 * @returns {BlogCategory | null} - The category object or null if not found.
 *
 * @usage
 * const { category, isLoading, isError } = useCategoryDetail(slug);
 *
 * @notes
 * - Fetches category details based on the provided slug.
 * - Populates subcategories for hierarchical data structure.
 * - Uses React Query for efficient data fetching and caching.
 */

export const getOneCategory = async (req: Request, res: Response): Promise<void> => {
    try {
      const { slug } = req.params;
  
      // 🔥 Tìm category theo slug và populate danh mục con
      const category = await BlogCategory.findOne({ slug }).populate("subcategories").lean();
      if (!category) {
        res.status(404).json({ message: "Category not found" });
        return;
      }
  
      res.status(200).json(category);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };
  
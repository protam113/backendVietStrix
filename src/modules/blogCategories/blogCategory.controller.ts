import { Request, Response } from "express";
import { BlogCategoryService } from "./blogCategory.service";
import { AppError } from "../../helpers/AppError"; 


let blogCategoryService = new BlogCategoryService(); // Biến toàn cục để lưu service instance

export const setBlogCategoryService = (service: BlogCategoryService) => {
  blogCategoryService = service; // Cho phép thay thế service khi test
};


export const createBlogCategory = async (req: Request, res: Response): Promise<void> => {
    try {
        const newBlogCategory = await blogCategoryService.createBlogCategory(req.body);
        res.status(201).json({ message: "Blog category created successfully", data: newBlogCategory });
    } catch (error: any) {
        console.error("Error creating BlogCategory:", error);

        if (error instanceof AppError) {
            res.status(error.statusCode).json({ message: error.message });
            return;
        }

        res.status(500).json({ message: "Internal Server Error" });
    }
};


export const getBlogCategories = async (req: Request, res: Response) => {
  try {
    const result = await blogCategoryService.getBlogCategory(req.query);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching BlogCategory:", error instanceof Error ? error.stack : error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getBlogCategoriesById = async (req: Request, res: Response): Promise<void> => {
    try {
      const blogCategory = await blogCategoryService.getBlogCategoryById(req.params.id);
      if (!blogCategory) {
        res.status(404).json({ message: "BlogCategory not found" });
        return; // Đảm bảo kết thúc hàm
      }
      res.status(200).json({ data: blogCategory });
    } catch (error) {
      console.error("Error fetching blogCategory by ID:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
};

export const updateBlogCategory = async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, slug } = req.body; 
      const updatedBlogCategory = await blogCategoryService.updateBlogCategoryID(req.params.id, name, slug);
      
      if (!updatedBlogCategory) {
        res.status(404).json({ message: "BlogCategory not found" });
        return;
      }
  
      res.status(200).json({ message: "BlogCategory updated", data: updatedBlogCategory });
    } catch (error) {
      console.error("Error updating category:", error);
      res.status(400).json({ message: (error as Error).message });
    }
  };
  
  

export const deleteBlogCategory = async (req: Request, res: Response): Promise<void> => {
    try {
      const deletedBlogCategory = await blogCategoryService.deleteBLogCategory(req.params.id);
      if (!deletedBlogCategory) {
        res.status(404).json({ message: "BLogCategory not found" });
        return;
      }
      res.status(200).json({ message: "BLogCategory deleted successfully" });
    } catch (error) {
      console.error("Error deleting BLogCategory:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
  
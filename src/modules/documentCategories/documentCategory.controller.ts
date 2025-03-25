import { Request, Response } from 'express';
import { DocumentCategoryService } from './documentCategory.service';
import { AppError } from '../../helpers/AppError';

let documentCategoryService = new DocumentCategoryService(); // Biến toàn cục để lưu service instance

export const setDocumentCategoryService = (
  service: DocumentCategoryService
) => {
  documentCategoryService = service; // Cho phép thay thế service khi test
};

export const createDocCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const newDocumentCategory =
      await documentCategoryService.createDocumentCategory(req.body);
    res.status(201).json({
      message: 'Document category created successfully',
      data: newDocumentCategory,
    });
  } catch (error: any) {
    console.error('Error creating DocumentCategory:', error);

    if (error instanceof AppError) {
      res.status(error.statusCode).json({ message: error.message });
      return;
    }

    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getDocumentCategories = async (req: Request, res: Response) => {
  try {
    const result = await documentCategoryService.getDocumentCategory(req.query);
    res.status(200).json(result);
  } catch (error) {
    console.error(
      'Error fetching documentCategories:',
      error instanceof Error ? error.stack : error
    );
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getDocumentCategoriesById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const documentCategory =
      await documentCategoryService.getDocumentCategoryById(req.params.id);
    if (!documentCategory) {
      res.status(404).json({ message: 'documentCategory not found' });
      return; // Đảm bảo kết thúc hàm
    }
    res.status(200).json({ data: documentCategory });
  } catch (error) {
    console.error('Error fetching documentCategory by ID:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const updateDocumentCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, slug } = req.body;
    const updatedDocumentCategory =
      await documentCategoryService.updateDocumentCategoryID(
        req.params.id,
        name,
        slug
      );

    if (!updatedDocumentCategory) {
      res.status(404).json({ message: 'DocumentCategory not found' });
      return;
    }

    res.status(200).json({
      message: 'DocumentCategory updated',
      data: updatedDocumentCategory,
    });
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(400).json({ message: (error as Error).message });
  }
};

export const deleteDocumentCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const deletedDocumentCategory =
      await documentCategoryService.deleteDocumentCategory(req.params.id);
    if (!deletedDocumentCategory) {
      res.status(404).json({ message: 'DocumentCategory not found' });
      return;
    }
    res.status(200).json({ message: 'DocumentCategory deleted successfully' });
  } catch (error) {
    console.error('Error deleting DocumentCategory:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

import { Request, Response } from "express";
import { DocumentService } from "./document.service";
import { AppError } from "../../helpers/AppError"; 


let documentService = new DocumentService(); // Biến toàn cục để lưu service instance

export const setContactService = (service: DocumentService) => {
  documentService = service; // Cho phép thay thế service khi test
};

export const createDocumentData = async (req: Request, res: Response): Promise<void> => {
  try {
    const newDocument = await documentService.createDocument(req.body);
    res.status(201).json({ 
      message: "Document created successfully", 
      data: newDocument 
    });
  } catch (error) {
    console.error("Error creating document:", error instanceof Error ? error.stack : error);
    
    // Handle AppError with its status code
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ 
        message: error.message 
      });
      return; // Add return statement without a value
    }
    
    // For other errors
    res.status(500).json({ 
      message: "Internal Server Error" 
    });
  }
};


export const getDocument = async (req: Request, res: Response) => {
  try {
    const result = await documentService.getDocuments(req.query);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching document:", error instanceof Error ? error.stack : error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getDocumentDataBySlug = async (req: Request, res: Response): Promise<void> => {
    try {
      const contact = await documentService.getDocumentBySlug(req.params.slug);
      if (!contact) {
        res.status(404).json({ message: "Document not found" });
        return; // Đảm bảo kết thúc hàm
      }
      res.status(200).json({ data: contact });
    } catch (error) {
      console.error("Error fetching document by slug:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
};

  

export const deleteDocument = async (req: Request, res: Response): Promise<void> => {
    try {
      const deletedDocument = await documentService.deleteContact(req.params.id);
      if (!deletedDocument) {
        res.status(404).json({ message: "Document not found" });
        return;
      }
      res.status(200).json({ message: "Document deleted successfully" });
    } catch (error) {
      console.error("Error deleting document:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
  
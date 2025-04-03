// blogCategory.controller.ts

import { Request, Response } from 'express';
import { FaQService } from './faq.service';
import { AppError } from '../../helpers/AppError';

let faqService = new FaQService(); // Biến toàn cục để lưu service instance

export const setFaqService = (service: FaQService) => {
  faqService = service; // Cho phép thay thế service khi test
};

export const createFaQ = async (req: Request, res: Response): Promise<void> => {
  try {
    const newBlogCategory = await faqService.createFaQ(req.body);
    res.status(201).json({
      message: 'FaQ created successfully',
      data: newBlogCategory,
    });
  } catch (error: any) {
    console.error('Error creating FaQ:', error);

    if (error instanceof AppError) {
      res.status(error.statusCode).json({ message: error.message });
      return;
    }

    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getFaQs = async (req: Request, res: Response) => {
  try {
    const result = await faqService.getFaQ(req.query);
    res.status(200).json(result);
  } catch (error) {
    console.error(
      'Error fetching FaQ:',
      error instanceof Error ? error.stack : error
    );
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const updateFaQ = async (req: Request, res: Response): Promise<void> => {
  try {
    const { question, answer } = req.body;
    const updatedFaq = await faqService.updateFaQID(
      req.params.id,
      question,
      answer
    );

    if (!updatedFaq) {
      res.status(404).json({ message: 'FaQ not found' });
      return;
    }

    res.status(200).json({ message: 'FaQ updated', data: updatedFaq });
  } catch (error) {
    console.error('Error updating FaQ:', error);
    res.status(400).json({ message: (error as Error).message });
  }
};

export const deleteFaQDetail = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const deletedFaq = await faqService.deleteFaQ(req.params.id);
    if (!deletedFaq) {
      res.status(404).json({ message: 'FaQ not found' });
      return;
    }
    res.status(200).json({ message: 'FaQ deleted successfully' });
  } catch (error) {
    console.error('Error deleting BLogCategory:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

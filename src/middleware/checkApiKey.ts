import { Request, Response, NextFunction } from 'express';
import * as dotenv from 'dotenv';

dotenv.config();

// API key validation interface
interface ApiKeyValidationResult {
  isValid: boolean;
  message?: string;
}

export const checkApiKey = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const clientApiKey = req.headers['api-key'] as string;
  const validationResult = validateApiKey(clientApiKey);

  if (!validationResult.isValid) {
    res.status(validationResult.isValid ? 200 : 401).json({
      error: validationResult.message || 'Authentication failed',
    });
    return;
  }

  next();
};

// Separate validation logic for better testability and flexibility
const validateApiKey = (clientApiKey?: string): ApiKeyValidationResult => {
  const API_KEY = process.env.NEXT_PRIVATE_API_KEY || '';

  if (!clientApiKey) {
    return {
      isValid: false,
      message: 'API key is required',
    };
  }

  if (clientApiKey !== API_KEY) {
    return {
      isValid: false,
      message: 'Invalid API key',
    };
  }

  return { isValid: true };
};

import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import mongoose from 'mongoose';

// Enum cho các loại lỗi khác nhau
export enum ErrorType {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  DUPLICATE_KEY = 'DUPLICATE_KEY',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  INTERNAL_SERVER = 'INTERNAL_SERVER',
}

// Interface cho lỗi chi tiết
interface ErrorResponse {
  type: ErrorType;
  message: string;
  details?: any;
  errorCode?: string;
}

// Lớp lỗi tùy chỉnh
export class AppError extends Error {
  statusCode: number;
  type: ErrorType;
  errorCode?: string;

  constructor(
    message: string,
    type: ErrorType = ErrorType.INTERNAL_SERVER,
    statusCode: number = 500,
    errorCode?: string
  ) {
    super(message);
    this.name = 'AppError';
    this.type = type;
    this.statusCode = statusCode;
    this.errorCode = errorCode;
  }
}

// Middleware xử lý lỗi
export const errorHandlingMiddleware = (
  err: Error & { code?: number; keyValue?: any },
  res: Response
) => {
  // Log lỗi (có thể tích hợp với Winston hoặc logging service)
  console.error(`[Error Logging] ${err.name}: ${err.message}`, err);

  // Xử lý các loại lỗi cụ thể
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      type: err.type,
      message: err.message,
      errorCode: err.errorCode,
    });
  }

  // Xử lý lỗi Zod Validation
  if (err instanceof ZodError) {
    return res.status(400).json({
      type: ErrorType.VALIDATION_ERROR,
      message: 'Validation Error',
      details: err.errors.map((e) => ({
        path: e.path.join('.'),
        message: e.message,
      })),
    });
  }

  // Xử lý lỗi Mongoose Validation
  if (err.name === 'ValidationError') {
    const errors = Object.values(
      (err as mongoose.Error.ValidationError).errors
    ).map((e) => e.message);

    return res.status(400).json({
      type: ErrorType.VALIDATION_ERROR,
      message: 'Mongoose Validation Error',
      details: errors,
    });
  }

  // Xử lý lỗi trùng key (duplicate key)
  if (err.code === 11000) {
    return res.status(409).json({
      type: ErrorType.DUPLICATE_KEY,
      message: 'Duplicate key error',
      details: err.keyValue,
    });
  }

  // Lỗi mặc định
  const genericError: ErrorResponse = {
    type: ErrorType.INTERNAL_SERVER,
    message: 'Internal Server Error',
    details: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  };

  res.status(500).json(genericError);
};

// Middleware bắt lỗi không xác định (404)
export const notFoundMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const error = new AppError(
    `Cannot find ${req.originalUrl} on this server`,
    ErrorType.NOT_FOUND,
    404
  );
  next(error);
};

// Hàm trợ giúp tạo lỗi
export const createError = (
  message: string,
  type: ErrorType = ErrorType.INTERNAL_SERVER,
  statusCode: number = 500,
  errorCode?: string
) => new AppError(message, type, statusCode, errorCode);

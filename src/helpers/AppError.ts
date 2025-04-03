// utils/AppError.ts
export enum ErrorType {
  BAD_REQUEST = 'BAD_REQUEST',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  CONFLICT = 'CONFLICT',
  UNPROCESSABLE = 'UNPROCESSABLE',
  INTERNAL_SERVER = 'INTERNAL_SERVER',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
}

export interface ErrorContext {
  [key: string]: any;
}

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly type: ErrorType;
  public readonly isOperational: boolean;
  public readonly context?: ErrorContext;
  public readonly errorCode?: string;

  constructor(params: {
    message: string;
    statusCode?: number;
    type?: ErrorType;
    isOperational?: boolean;
    context?: ErrorContext;
    errorCode?: string;
  }) {
    const {
      message,
      statusCode = 500,
      type = ErrorType.INTERNAL_SERVER,
      isOperational = true,
      context,
      errorCode,
    } = params;

    super(message);

    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.type = type;
    this.isOperational = isOperational;
    this.context = context;
    this.errorCode = errorCode;

    // Giữ nguyên stack trace
    Error.captureStackTrace(this, this.constructor);
  }

  // Phương thức tĩnh để tạo lỗi nhanh
  static create(
    message: string,
    options: {
      statusCode?: number;
      type?: ErrorType;
      isOperational?: boolean;
      context?: ErrorContext;
      errorCode?: string;
    } = {}
  ) {
    return new AppError({
      message,
      statusCode: options.statusCode,
      type: options.type,
      isOperational: options.isOperational,
      context: options.context,
      errorCode: options.errorCode,
    });
  }
  // Phương thức tĩnh cho các loại lỗi thường gặp
  static badRequest(message: string, context?: ErrorContext) {
    return new AppError({
      message,
      statusCode: 400,
      type: ErrorType.BAD_REQUEST,
      context,
    });
  }

  static unauthorized(message: string, context?: ErrorContext) {
    return new AppError({
      message,
      statusCode: 401,
      type: ErrorType.UNAUTHORIZED,
      context,
    });
  }

  static forbidden(message: string, context?: ErrorContext) {
    return new AppError({
      message,
      statusCode: 403,
      type: ErrorType.FORBIDDEN,
      context,
    });
  }

  static notFound(message: string, context?: ErrorContext) {
    return new AppError({
      message,
      statusCode: 404,
      type: ErrorType.NOT_FOUND,
      context,
    });
  }

  static conflict(message: string, context?: ErrorContext) {
    return new AppError({
      message,
      statusCode: 409,
      type: ErrorType.CONFLICT,
      context,
    });
  }

  // Chuyển đổi lỗi sang đối tượng JSON để response
  toJSON() {
    return {
      message: this.message,
      type: this.type,
      statusCode: this.statusCode,
      errorCode: this.errorCode,
      context: this.context,
      ...(process.env.NODE_ENV === 'development' && { stack: this.stack }),
    };
  }

  // Log error với định dạng thống nhất
  log() {
    console.error(
      JSON.stringify(
        {
          timestamp: new Date().toISOString(),
          name: this.name,
          message: this.message,
          type: this.type,
          statusCode: this.statusCode,
          stack: this.stack,
          context: this.context,
        },
        null,
        2
      )
    );
  }
}

// Ví dụ sử dụng
export const createValidationError = (details: ErrorContext) =>
  AppError.badRequest('Validation Error', {
    validationErrors: details,
  });

import { Request, Response, NextFunction } from "express";
import * as dotenv from "dotenv";

dotenv.config();

// API_KEY đúng (có thể lưu vào biến môi trường `.env`)
const API_KEY = process.env.NEXT_PRIVATE_API_KEY || "";

export const checkApiKey = (req: Request, res: Response, next: NextFunction): void => {
    const clientApiKey = req.headers["api-key"] as string;
  
    if (!clientApiKey) {
      res.status(401).json({ error: "API key is required" });
      return; // 🔥 Thêm return để tránh lỗi
    }
  
    if (clientApiKey !== API_KEY) {
      res.status(403).json({ error: "Invalid API key" });
      return; // 🔥 Thêm return để tránh lỗi
    }
  
    next(); // Tiếp tục xử lý request nếu API key hợp lệ
  };
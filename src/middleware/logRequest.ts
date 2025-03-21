import express from "express";

// Tạo một middleware ghi log tất cả các API được gọi
export const logRequest = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const start = Date.now();
    
    res.on('finish', () => {
        if (process.env.NODE_ENV === "development") {
            const { method, originalUrl, headers, body } = req;
            const timestamp = new Date().toISOString();
            const responseTime = Date.now() - start;
            console.log(`[${timestamp}] ${method} ${originalUrl} ${res.statusCode} - ${responseTime}ms`);
            console.log("Headers:", headers);
            console.log("Body:", body);
        }
    });

    next(); // Tiếp tục xử lý request đến route handler
};

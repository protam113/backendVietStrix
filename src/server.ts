import express from "express";
import connectDB from "./config/db";
import { createServer } from "http";
import cookieParser from "cookie-parser";
import * as dotenv from "dotenv";
import corsConfig from "./config/cors";
import categoryRoutes from "./routes/categoryRoutes";
import documentRoutes from "./routes/docsRoutes";
import contactRoutes from "./routes/contactRoutes";
import blogCategoryRoutes from "./routes/blogCategoryRoutes";
import blogRoutes from "./routes/blogRoutes";

import { logRequest } from "./middleware/logRequest";

dotenv.config();

const app = express();
const server = createServer(app);
const PORT = process.env.PORT || 3000;
const API_VERSION = process.env.API_VERSION || "v1";

app.use(logRequest)


const apiPath = (route: string) => `/api/${API_VERSION}${route}`;

// Middleware trước khi khai báo routes
app.use(corsConfig);
app.use(express.json());
app.use(cookieParser());
app.use(logRequest);

// Routes
app.use(apiPath("/docCategory"), categoryRoutes); 
app.use(apiPath("/document"), documentRoutes); 
app.use(apiPath("/contact"), contactRoutes);
app.use(apiPath("/blogCategory"), blogCategoryRoutes); 
app.use(apiPath("/blog"), blogRoutes);



// 


const startServer = async () => {
    try {
        console.log(`🔄 Connecting to the database...`);
        await connectDB();
        console.log(`✅ Database connected successfully!`);

        server.listen(PORT, () => {
            console.log(`🚀 Server (API ${API_VERSION}) is running on port ${PORT}`);
        });
    } catch (error) {
        console.error("❌ Server failed to start due to an error:");
        console.error(error);
        process.exit(1);
    }
};

startServer();

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error("Error occurred:", err); // Ghi lỗi vào console hoặc log
    res.status(500).json({ message: "Internal Server Error" }); // Trả lỗi cho người dùng
});

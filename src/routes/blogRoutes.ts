import express from "express";
import { createBlog, getAllBlogs, getOneBlog } from "../controllers/BlogControllers";
import { checkApiKey } from "../middleware/checkApiKey"; // Import middleware

const router = express.Router();

router.post("/", checkApiKey,createBlog);
router.get("/", getAllBlogs);
router.get("/:slug", getOneBlog); // Đổi `:id` thành `:slug`

export default router;

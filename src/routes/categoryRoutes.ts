import express from "express";
import { createCategory, getAllCategories, getOneCategory } from "../controllers/CategoryController";
import { checkApiKey } from "../middleware/checkApiKey"; // Import middleware

const router = express.Router();

router.post("/",checkApiKey, createCategory);
router.get("/", getAllCategories);
router.get("/:id", getOneCategory);

export default router;

import express from "express";
import { createCategory, getAllCategories, getOneCategory } from "../controllers/BlogCategoryController";
import { checkApiKey } from "../middleware/checkApiKey"; // Import middleware
/**
 * ==========================
 * 📌 @API Blog Category Routes
 * ==========================
 *
 * @description API endpoints for managing blog categories.
 *
 * @middleware
 * - `checkApiKey`: Ensures the request is authenticated using an API key.
 *
 * @usage
 * - Import this router and use it in your Express app: `app.use("/categories", categoryRouter);`
 */

const router = express.Router();


/**
 * ==========================
 * 🆕 CREATE CATEGORY
 * ==========================
 *
 * @route   POST /categories
 * @access  Private (Requires API Key)
 * @desc    Creates a new blog category.
 *
 * @body
 * {
 *   "name": "JavaScript",
 *   "slug": "javascript",
 *   "parentId": "123" // (Optional) ID of the parent category, null if root category
 * }
 *
 * @returns
 * {
 *   "_id": "abc123",
 *   "name": "JavaScript",
 *   "slug": "javascript",
 *   "subcategories": [],
 *   "createdAt": "2025-03-21T07:16:36.745Z",
 *   "updatedAt": "2025-03-21T07:16:36.745Z"
 * }
 *
 * @notes
 * - Requires an API key for authentication.
 * - Supports creating a root category (parentId = null) or a subcategory (parentId provided).
 * - Automatically assigns a UUID as `_id`.
 */
router.post("/", checkApiKey, createCategory);

/**
 * ==========================
 * 📌 GET ALL CATEGORIES
 * ==========================
 *
 * @route   GET /categories
 * @access  Public
 * @desc    Retrieves a paginated list of blog categories.
 *
 * @query
 * - `page` (number) - The current page number (default: 1).
 * - `limit` (number) - Number of categories per page (default: 10).
 * - `parentId` (string, optional) - If provided, returns only subcategories of the given parent.
 *
 * @returns
 * {
 *   "data": [
 *     {
 *       "_id": "abc123",
 *       "name": "Lập trình",
 *       "slug": "lap-trinh",
 *       "subcategories": [{ "_id": "xyz456", "name": "JavaScript", "slug": "javascript" }],
 *       "createdAt": "2025-03-21T07:16:36.745Z",
 *       "updatedAt": "2025-03-21T07:16:36.745Z"
 *     }
 *   ],
 *   "pagination": {
 *     "page": 1,
 *     "limit": 10,
 *     "total": 2,
 *     "totalPages": 1
 *   }
 * }
 *
 * @notes
 * - Supports pagination (`page`, `limit`).
 * - Allows filtering by `parentId` to get subcategories of a specific category.
 * - Uses `.populate("subcategories")` to return full subcategory details.
 */
router.get("/", getAllCategories);

/**
 * ==========================
 * 🔍 GET SINGLE CATEGORY
 * ==========================
 *
 * @route   GET /categories/:slug
 * @access  Public
 * @desc    Retrieves a single category by its slug.
 *
 * @param
 * - `slug` (string) - The slug of the category to retrieve.
 *
 * @returns
 * {
 *   "_id": "abc123",
 *   "name": "JavaScript",
 *   "slug": "javascript",
 *   "subcategories": [],
 *   "createdAt": "2025-03-21T07:16:36.745Z",
 *   "updatedAt": "2025-03-21T07:16:36.745Z"
 * }
 *
 * @notes
 * - Retrieves a single category based on its slug instead of `_id`.
 * - Returns full subcategory details using `.populate("subcategories")`.
 * - If the category does not exist, returns `404 Category not found`.
 */
router.get("/:slug", getOneCategory);

export default router;

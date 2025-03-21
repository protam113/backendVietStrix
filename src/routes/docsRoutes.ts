import express from "express";
import { createDocs, getAllDocs, getOneDoc } from "../controllers/DocsController";
import { checkApiKey } from "../middleware/checkApiKey"; // Import middleware

const router = express.Router();

router.post("/", checkApiKey,createDocs);
router.get("/", getAllDocs);
router.get("/:slug", getOneDoc); // Đổi `:id` thành `:slug`

export default router;

import express from "express";
import * as DocumentController from "./document.controller";
import { checkApiKey } from "../../middleware/checkApiKey";

const router = express.Router();

router
  .route("/")
  .post(DocumentController.createDocumentData)
  .get(checkApiKey, DocumentController.getDocument);

router
  .route("/:slug")
  .get(checkApiKey, DocumentController.getDocumentDataBySlug)

  router
  .route("/:id")
  .delete(checkApiKey, DocumentController.deleteDocument);
export default router;

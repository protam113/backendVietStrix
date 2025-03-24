import express from "express";
import * as DocumentCategoryController from "./documentCategory.controller";
import { checkApiKey } from "../../middleware/checkApiKey";

const router = express.Router();

router
  .route("/")
  .post(checkApiKey,DocumentCategoryController.createDocCategory)
  .get( DocumentCategoryController.getDocumentCategories);

  router
  .route("/:id")
  .get(checkApiKey, DocumentCategoryController.getDocumentCategoriesById)
  .delete(checkApiKey, DocumentCategoryController.deleteDocumentCategory) 
  .patch(checkApiKey, DocumentCategoryController.updateDocumentCategory); 


export default router;

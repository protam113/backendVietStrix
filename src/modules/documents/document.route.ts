import express from 'express';
import * as DocumentController from './document.controller';
import { checkApiKey } from '../../middleware/checkApiKey';
import upload from '../../config/formData';

const router = express.Router();

router
  .route('/')
  .post(checkApiKey, upload.none(), DocumentController.createDocumentData)
  .get(checkApiKey, DocumentController.getDocument);

router
  .route('/:slug')
  .get(checkApiKey, DocumentController.getDocumentDataBySlug);

router.route('/:id').delete(checkApiKey, DocumentController.deleteDocument);

export default router;

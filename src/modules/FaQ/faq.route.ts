import express from 'express';
import * as FaQController from './faq.controller';
import { checkApiKey } from '../../middleware/checkApiKey';

const router = express.Router();

router
  .route('/')
  .post(checkApiKey, FaQController.createFaQ)
  .get(checkApiKey, FaQController.getFaQs);

router
  .route('/:id')
  .delete(checkApiKey, FaQController.deleteFaQDetail)
  .patch(checkApiKey, FaQController.updateFaQ);

export default router;

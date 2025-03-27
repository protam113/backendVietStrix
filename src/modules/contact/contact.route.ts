import express from 'express';
import * as ContactController from './contact.controller';
import { checkApiKey } from '../../middleware/checkApiKey';

const router = express.Router();

router
  .route('/')
  .post(ContactController.createContact)
  .get(checkApiKey, ContactController.getContacts);

router
  .route('/:id')
  .get(checkApiKey, ContactController.getContactById)
  .delete(checkApiKey, ContactController.deleteContact);

router
  .route('/:id/status')
  .patch(checkApiKey, ContactController.updateContactStatus);

export default router;

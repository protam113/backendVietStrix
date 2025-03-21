import { createContact, deleteContact, getContactById, getContacts, updateContactStatus } from "../controllers/contactController";
import express from "express";
import { checkApiKey } from "../middleware/checkApiKey"; 


const router = express.Router();

router.post("/", createContact);
router.get("/",checkApiKey, getContacts);
router.get("/:id",checkApiKey, getContactById);
router.patch("/:id/status", checkApiKey,updateContactStatus);
router.delete("/:id",checkApiKey, deleteContact);

export default router; 

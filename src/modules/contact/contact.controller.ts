import { Request, Response } from 'express';
import { ContactService } from './contact.service';
import upload from '../../config/multer.config';
import sendThankYouEmail from '../../services/mailService';

let contactService = new ContactService();

export const setContactService = (service: ContactService) => {
  contactService = service; // Cho phép thay thế service khi test
};

export const createContact = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    await upload.none()(req, res, async () => {
      const { name, email, message } = req.body;

      if (!name || !email || !message) {
        res.status(400).json({ message: 'Missing required fields' });
        return;
      }

      const newContact = await contactService.createContact(req.body);
      res
        .status(201)
        .json({ message: 'Contact created successfully', data: newContact });

      try {
        await sendThankYouEmail({
          recipientEmail: email,
          name: name,
        });
        console.log('🎉 Email sent successfully!');
      } catch (error) {
        console.error('❌ Email send failed:', error);
      }
    });
  } catch (error) {
    console.error('Error creating contact:', error);
    res.status(500).json({
      message: 'Error processing request',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const getContacts = async (req: Request, res: Response) => {
  try {
    const result = await contactService.getContacts(req.query);
    res.status(200).json(result);
  } catch (error) {
    console.error(
      'Error fetching contacts:',
      error instanceof Error ? error.stack : error
    );
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getContactById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const contact = await contactService.getContactById(req.params.id);
    if (!contact) {
      res.status(404).json({ message: 'Contact not found' });
      return; // Đảm bảo kết thúc hàm
    }
    res.status(200).json({ data: contact });
  } catch (error) {
    console.error('Error fetching contact by ID:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const updateContactStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const updatedContact = await contactService.updateContactStatus(
      req.params.id,
      req.body.status
    );
    if (!updatedContact) {
      res.status(404).json({ message: 'Contact not found' });
      return; // ✅ Kết thúc hàm mà không return Response
    }
    res.status(200).json({ message: 'Status updated', data: updatedContact });
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(400).json({ message: (error as Error).message });
  }
};

export const deleteContact = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const deletedContact = await contactService.deleteContact(req.params.id);
    if (!deletedContact) {
      res.status(404).json({ message: 'Contact not found' });
      return;
    }
    res.status(200).json({ message: 'Contact deleted successfully' });
  } catch (error) {
    console.error('Error deleting contact:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

import { Request, Response } from "express";
import ContactForm from "../models/Contact";

/**
 * ==========================
 * 📌 @FUNCTION createContact
 * ==========================
 *
 * @description Creates a new contact entry.
 *
 * @param {Request} req - Express request object containing contact details in `req.body`.
 * @param {Response} res - Express response object.
 *
 * @returns {Object} - Returns a success message and the created contact object.
 *
 * @usage
 * POST /api/contacts
 * Body: { name, email, phone_number, message, link }
 *
 * @notes
 * - Default `status` is set to "pending".
 * - Ensures the contact is saved to the database before responding.
 * - Handles errors gracefully and returns a 500 status if any exception occurs.
 */
export const createContact = async (req: Request, res: Response) => {
    try {
      const { name, email, phone_number, message, link } = req.body;
  
      const newContact = new ContactForm({
        name,
        email,
        phone_number,
        message,
        link,
        status: "pending", // Mặc định là pending
      });
  
      await newContact.save();
      res.status(201).json({ message: "Contact form submitted successfully", data: newContact });
    } catch (error) {
      console.error("Error creating contact:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
  
/**
 * ==========================
 * 📌 @HOOK useCategoryDetail
 * ==========================
 *
 * @description Custom hook to retrieve details of a specific category.
 *
 * @param {string} slug - The slug of the category.
 * @returns {Category | null} - The category object or null if not found.
 *
 * @usage
 * const { category, isLoading, isError } = useCategoryDetail(slug);
 *
 * @notes
 * - Fetches category details based on the provided slug.
 * - Populates subcategories for hierarchical data structure.
 * - Uses React Query for efficient data fetching and caching.
 */

export const getContacts = async (req: Request, res: Response) => {
  try {
    const { status, page = "1", limit = "10", createdAt_min = "desc" } = req.query;

    const filter: any = {};
    if (status) {
      filter.status = status;
    }

    const pageNumber = Math.max(parseInt(page as string, 10), 1);
    const limitNumber = Math.max(parseInt(limit as string, 10), 1);
    const skip = (pageNumber - 1) * limitNumber;

    const sortOrder = createdAt_min === "asc" ? 1 : -1;

    const contacts = await ContactForm.find(filter)
      .sort({ createdAt: sortOrder })
      .skip(skip)
      .limit(limitNumber);

    const totalContacts = await ContactForm.countDocuments(filter);
    const totalPages = Math.ceil(totalContacts / limitNumber);

    res.status(200).json({
      data: contacts,
      pagination: {
        currentPage: pageNumber,
        totalPages,
        totalItems: totalContacts,
        itemsPerPage: limitNumber,
      },
    });
  } catch (error) {
    console.error("Error fetching contacts:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * ==========================
 * 📌 @FUNCTION getContactById
 * ==========================
 *
 * @description Retrieves a contact entry by its unique ID.
 *
 * @param {Request} req - The request object containing the contact ID in `req.params.id`.
 * @param {Response} res - The response object.
 *
 * @returns {Object} - The contact data if found, otherwise an error message.
 *
 * @usage
 * fetch('/api/contacts/654321abcdef', {
 *   method: 'GET',
 * })
 * .then(res => res.json())
 * .then(data => console.log(data));
 *
 * @notes
 * - If the contact ID does not exist, returns a 404 status with an error message.
 * - Proper error handling included to return a 500 status in case of server issues.
 */
  export const getContactById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const contact = await ContactForm.findById(id);

        if (!contact) {
            res.status(404).json({ message: "Contact form not found" }); // ❌ Đừng return ở đây
            return;
        }

        res.status(200).json({ data: contact });
    } catch (error) {
        console.error("Error fetching contact by ID:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

/**
 * ==================================
 * 📌 @FUNCTION updateContactStatus
 * ==================================
 *
 * @description Updates the status of a specific contact form entry.
 *
 * @param {Request} req - The request object containing:
 *   - `req.params.id`: The unique ID of the contact entry.
 *   - `req.body.status`: The new status value (must be "pending", "approved", or "rejected").
 * @param {Response} res - The response object.
 *
 * @returns {Object} - The updated contact data if successful, otherwise an error message.
 *
 * @usage
 * fetch('/api/contacts/654321abcdef/status', {
 *   method: 'PATCH',
 *   headers: { 'Content-Type': 'application/json' },
 *   body: JSON.stringify({ status: 'approved' }),
 * })
 * .then(res => res.json())
 * .then(data => console.log(data));
 *
 * @notes
 * - Returns `400 Bad Request` if an invalid status value is provided.
 * - Returns `404 Not Found` if the contact ID does not exist.
 * - Uses `{ new: true, runValidators: true }` to return updated data and validate input.
 */
export const updateContactStatus = async (req: Request, res: Response): Promise<void> => {
  try {
      const { id } = req.params;
      const { status } = req.body;

      if (!["pending", "approved", "rejected"].includes(status)) {
          res.status(400).json({ message: "Invalid status value" });
          return;
      }

      const updatedContact = await ContactForm.findByIdAndUpdate(
          id,
          { status },
          { new: true, runValidators: true }
      );

      if (!updatedContact) {
          res.status(404).json({ message: "Contact form not found" });
          return;
      }

      res.status(200).json({ message: "Contact status updated", data: updatedContact });
  } catch (error) {
      console.error("Error updating contact status:", error);
      res.status(500).json({ message: "Internal Server Error" });
  }
};

  
  /**
 * ==========================
 * 📌 @FUNCTION deleteContact
 * ==========================
 *
 * @description Deletes a contact entry by its unique ID.
 *
 * @param {Request} req - The request object containing the contact ID in `req.params.id`.
 * @param {Response} res - The response object.
 *
 * @returns {Object} - A success message if deletion is successful, otherwise an error message.
 *
 * @usage
 * fetch('/api/contacts/654321abcdef', {
 *   method: 'DELETE',
 * })
 * .then(res => res.json())
 * .then(data => console.log(data));
 *
 * @notes
 * - If the contact ID does not exist, returns a 404 status with an error message.
 * - Proper error handling included to return a 500 status in case of server issues.
 */
  export const deleteContact = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const deletedContact = await ContactForm.findByIdAndDelete(id);

        if (!deletedContact) {
            res.status(404).json({ message: "Contact form not found" });
            return;
        }

        res.status(200).json({ message: "Contact form deleted successfully" });
    } catch (error) {
        console.error("Error deleting contact:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

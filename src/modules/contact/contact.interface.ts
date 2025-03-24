export interface IContactForm {
    _id: string;
    name: string;
    email: string;
    phone_number: string;
    message: string;
    link?: string | null;
    status: "pending" | "approved" | "rejected";
    createdAt?: Date;
    updatedAt?: Date;
  }
  
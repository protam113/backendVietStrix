import { ContactRepository } from './contact.repository';

export class ContactService {
  private contactRepo: ContactRepository;

  constructor(contactRepo?: ContactRepository) {
    this.contactRepo = contactRepo || new ContactRepository();
  }

  async createContact(data: any) {
    return this.contactRepo.create({ ...data, status: 'pending' });
  }

  async getContacts(query: any) {
    const { status, page = '1', limit = '10', createdAt_min = 'desc' } = query;

    const filter: any = status ? { status } : {};
    const pageNumber = Math.max(Number(page), 1);
    const limitNumber = Math.max(Number(limit), 1);
    const skip = (pageNumber - 1) * limitNumber;
    const sortOrder = createdAt_min === 'asc' ? 1 : -1;

    const [result, totalContacts] = await Promise.all([
      this.contactRepo.findAll(filter, skip, limitNumber, {
        createdAt: sortOrder,
      }),
      this.contactRepo.count(filter),
    ]);

    return {
      result,
      pagination: {
        currentPage: pageNumber,
        totalPages: Math.ceil(totalContacts / limitNumber),
        totalItems: totalContacts,
        itemsPerPage: limitNumber,
      },
    };
  }

  async getContactById(_id: string) {
    return this.contactRepo.findById(_id);
  }

  async updateContactStatus(_id: string, status: string) {
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      throw new Error('Invalid status value');
    }
    return this.contactRepo.updateStatus(_id, status);
  }

  async deleteContact(_id: string) {
    return this.contactRepo.delete(_id);
  }
}

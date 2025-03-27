import ContactForm from './contact.model';

export class ContactRepository {
  async create(contactData: any) {
    try {
      return await ContactForm.create(contactData);
    } catch (error) {
      throw new Error(`Error creating contact: ${error}`);
    }
  }

  async findAll(
    filter: Record<string, any>,
    skip: number,
    limit: number,
    sort: Record<string, any>
  ) {
    try {
      return await ContactForm.find(filter).sort(sort).skip(skip).limit(limit);
    } catch (error) {
      throw new Error(`Error finding contacts: ${error}`);
    }
  }

  async count(filter: Record<string, any>) {
    try {
      return await ContactForm.countDocuments(filter);
    } catch (error) {
      throw new Error(`Error counting contacts: ${error}`);
    }
  }

  async findById(_id: string) {
    try {
      return await ContactForm.findById(_id);
    } catch (error) {
      throw new Error(`Error finding contact by ID: ${error}`);
    }
  }

  async updateStatus(_id: string, status: string) {
    try {
      return await ContactForm.findByIdAndUpdate(
        _id,
        { status },
        { new: true, runValidators: true }
      );
    } catch (error) {
      throw new Error(`Error updating contact status: ${error}`);
    }
  }

  async delete(_id: string) {
    try {
      return await ContactForm.findByIdAndDelete(_id);
    } catch (error) {
      throw new Error(`Error deleting contact: ${error}`);
    }
  }
}

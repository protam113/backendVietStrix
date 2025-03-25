import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import { ContactService } from '../src/modules/contact/contact.service';
import * as contactController from '../src/modules/contact/contact.controller';

jest.mock('../src/modules/contact/contact.service');

// Mock lại ContactService và gán vào controller
const contactServiceMock = new ContactService() as jest.Mocked<ContactService>;
contactController.setContactService(contactServiceMock);

const app = express();
app.use(express.json());

// Không cần truyền thêm tham số thứ ba
app.post('/contacts', contactController.createContact);
app.get('/contacts', contactController.getContacts);
app.get('/contacts/:id', contactController.getContactById);
app.put('/contacts/:id/status', contactController.updateContactStatus);
app.delete('/contacts/:id', contactController.deleteContact);

describe('Contact Controller', () => {
  let contactServiceMock: jest.Mocked<ContactService>;

  beforeEach(() => {
    contactServiceMock = new ContactService() as jest.Mocked<ContactService>;
    jest.clearAllMocks();
  });

  test('POST /contacts - should create a new contact', async () => {
    const mockContact = {
      _id: new mongoose.Types.ObjectId(),
      name: 'John Doe',
      email: 'john@example.com',
    };
    (contactServiceMock.createContact as jest.Mock).mockResolvedValue(
      mockContact
    );

    const response = await request(app).post('/contacts').send(mockContact);

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Contact created successfully');
    expect(response.body.data).toEqual(mockContact);
  });

  test('GET /contacts - should return a list of contacts', async () => {
    const mockContacts = [
      { _id: new mongoose.Types.ObjectId(), name: 'Alice' },
      { _id: new mongoose.Types.ObjectId(), name: 'Bob' },
    ];
    (contactServiceMock.getContacts as jest.Mock).mockResolvedValue(
      mockContacts
    );

    const response = await request(app).get('/contacts');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockContacts);
  });

  test('GET /contacts/:id - should return a contact by ID', async () => {
    const mockContact = { _id: new mongoose.Types.ObjectId(), name: 'Alice' };
    (contactServiceMock.getContactById as jest.Mock).mockResolvedValue(
      mockContact
    );

    const response = await request(app).get(`/contacts/${mockContact._id}`);

    expect(response.status).toBe(200);
    expect(response.body.data).toEqual(mockContact);
  });

  test('GET /contacts/:id - should return 404 if contact not found', async () => {
    (contactServiceMock.getContactById as jest.Mock).mockResolvedValue(null);

    const response = await request(app).get('/contacts/99');

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Contact not found');
  });

  test('PUT /contacts/:id/status - should update contact status', async () => {
    const updatedContact = {
      _id: new mongoose.Types.ObjectId(),
      name: 'Alice',
      status: 'active',
    };
    (contactServiceMock.updateContactStatus as jest.Mock).mockResolvedValue(
      updatedContact
    );

    const response = await request(app)
      .put(`/contacts/${updatedContact._id}/status`)
      .send({ status: 'active' });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Status updated');
    expect(response.body.data).toEqual(updatedContact);
  });

  test('PUT /contacts/:id/status - should return 404 if contact not found', async () => {
    (contactServiceMock.updateContactStatus as jest.Mock).mockResolvedValue(
      null
    );

    const response = await request(app)
      .put('/contacts/99/status')
      .send({ status: 'inactive' });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Contact not found');
  });

  test('DELETE /contacts/:id - should delete contact', async () => {
    (contactServiceMock.deleteContact as jest.Mock).mockResolvedValue(true);

    const response = await request(app).delete('/contacts/1');

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Contact deleted successfully');
  });

  test('DELETE /contacts/:id - should return 404 if contact not found', async () => {
    (contactServiceMock.deleteContact as jest.Mock).mockResolvedValue(null);

    const response = await request(app).delete('/contacts/99');

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Contact not found');
  });
});

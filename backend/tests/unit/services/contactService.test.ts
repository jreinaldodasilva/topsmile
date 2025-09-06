import { contactService } from '../../../src/services/contactService';
import { createTestContact } from '../../testHelpers';

describe('ContactService', () => {
  describe('createContact', () => {
    it('should create a new contact successfully', async () => {
      const contactData = {
        name: 'João Silva',
        email: 'joao.silva@example.com',
        clinic: 'Clínica Odontológica ABC',
        specialty: 'Ortodontia',
        phone: '(11) 99999-9999',
        source: 'website_contact_form'
      };

      const contact = await contactService.createContact(contactData);

      expect(contact).toBeDefined();
      expect(contact.name).toBe(contactData.name);
      expect(contact.email).toBe(contactData.email);
      expect(contact.clinic).toBe(contactData.clinic);
      expect(contact.specialty).toBe(contactData.specialty);
      expect(contact.phone).toBe(contactData.phone);
      expect(contact.status).toBe('new');
    });

    it('should update existing contact when email already exists', async () => {
      const contactData1 = {
        name: 'João Silva',
        email: 'joao@example.com',
        clinic: 'Clínica ABC',
        specialty: 'Ortodontia',
        phone: '(11) 99999-9999'
      };

      const contactData2 = {
        name: 'João Silva Santos',
        email: 'joao@example.com',
        clinic: 'Clínica XYZ',
        specialty: 'Implantodontia',
        phone: '(11) 88888-8888'
      };

      const contact1 = await contactService.createContact(contactData1);
      const contact2 = await contactService.createContact(contactData2);

      expect((contact1._id as any).toString()).toBe((contact2._id as any).toString());
      expect(contact2.name).toBe(contactData2.name);
      expect(contact2.clinic).toBe(contactData2.clinic);
      expect(contact2.specialty).toBe(contactData2.specialty);
      expect(contact2.phone).toBe(contactData2.phone);
    });
  });

  describe('createContactSafe', () => {
    it('should create new contact and return isNew: true', async () => {
      const contactData = {
        name: 'Maria Santos',
        email: 'maria@example.com',
        clinic: 'Clínica Maria',
        specialty: 'Endodontia',
        phone: '(11) 77777-7777'
      };

      const result = await contactService.createContactSafe(contactData);

      expect(result.contact).toBeDefined();
      expect(result.isNew).toBe(true);
      expect(result.message).toBe('Contato criado com sucesso');
    });

    it('should update existing contact and return isNew: false', async () => {
      const contactData1 = {
        name: 'Pedro Oliveira',
        email: 'pedro@example.com',
        clinic: 'Clínica Pedro',
        specialty: 'Periodontia',
        phone: '(11) 66666-6666'
      };

      const contactData2 = {
        name: 'Pedro Oliveira Santos',
        email: 'pedro@example.com',
        clinic: 'Clínica Pedro Atualizada',
        specialty: 'Periodontia Avançada',
        phone: '(11) 55555-5555'
      };

      await contactService.createContactSafe(contactData1);
      const result = await contactService.createContactSafe(contactData2);

      expect(result.isNew).toBe(false);
      expect(result.message).toBe('Contato atualizado com sucesso');
      expect(result.contact.name).toBe(contactData2.name);
    });
  });

  describe('getContactById', () => {
    it('should return contact by ID', async () => {
      const contactData = {
        name: 'Ana Costa',
        email: 'ana@example.com',
        clinic: 'Clínica Ana',
        specialty: 'Odontopediatria',
        phone: '(11) 44444-4444'
      };

      const createdContact = await contactService.createContact(contactData);
      const contact = await contactService.getContactById((createdContact._id as any).toString());

      expect(contact).toBeDefined();
      expect(contact?.name).toBe(contactData.name);
      expect(contact?.email).toBe(contactData.email);
    });

    it('should return null for non-existent contact', async () => {
      const contact = await contactService.getContactById('507f1f77bcf86cd799439011'); // Valid ObjectId format but doesn't exist

      expect(contact).toBeNull();
    });
  });

  describe('getContactByEmail', () => {
    it('should return contact by email', async () => {
      const contactData = {
        name: 'Carlos Ferreira',
        email: 'carlos@example.com',
        clinic: 'Clínica Carlos',
        specialty: 'Cirurgia',
        phone: '(11) 33333-3333'
      };

      await contactService.createContact(contactData);
      const contact = await contactService.getContactByEmail(contactData.email);

      expect(contact).toBeDefined();
      expect(contact?.name).toBe(contactData.name);
      expect(contact?.email).toBe(contactData.email);
    });

    it('should handle email case insensitivity', async () => {
      const contactData = {
        name: 'Test Case',
        email: 'testcase@example.com',
        clinic: 'Test Clinic',
        specialty: 'Test Specialty',
        phone: '(11) 22222-2222'
      };

      await contactService.createContact(contactData);
      const contact = await contactService.getContactByEmail('TESTCASE@EXAMPLE.COM');

      expect(contact).toBeDefined();
      expect(contact?.email).toBe(contactData.email);
    });
  });

  describe('getContacts', () => {
    beforeEach(async () => {
      // Create test contacts
      await createTestContact({
        name: 'Contact 1',
        email: 'contact1@example.com',
        clinic: 'Clinic A',
        specialty: 'General',
        status: 'new'
      });

      await createTestContact({
        name: 'Contact 2',
        email: 'contact2@example.com',
        clinic: 'Clinic B',
        specialty: 'Specialist',
        status: 'contacted'
      });

      await createTestContact({
        name: 'Contact 3',
        email: 'contact3@example.com',
        clinic: 'Clinic A',
        specialty: 'General',
        status: 'qualified'
      });
    });

    it('should return paginated contacts', async () => {
      const pagination = { page: 1, limit: 2 };
      const result = await contactService.getContacts({}, pagination);

      expect(result.contacts).toHaveLength(2);
      expect(result.total).toBe(3);
      expect(result.page).toBe(1);
      expect(result.pages).toBe(2);
      expect(result.limit).toBe(2);
    });

    it('should filter contacts by status', async () => {
      const filters = { status: 'new' };
      const pagination = { page: 1, limit: 10 };
      const result = await contactService.getContacts(filters, pagination);

      expect(result.contacts).toHaveLength(1);
      expect(result.contacts[0].status).toBe('new');
    });

    it('should search contacts by name', async () => {
      const filters = { search: 'Contact 1' };
      const pagination = { page: 1, limit: 10 };
      const result = await contactService.getContacts(filters, pagination);

      expect(result.contacts).toHaveLength(1);
      expect(result.contacts[0].name).toBe('Contact 1');
    });

    it('should sort contacts by created date descending', async () => {
      const pagination = { page: 1, limit: 10, sortBy: 'createdAt', sortOrder: 'desc' as const };
      const result = await contactService.getContacts({}, pagination);

      expect(result.contacts).toHaveLength(3);
      // Should be sorted by creation date (most recent first)
      const dates = result.contacts.map(c => c.createdAt.getTime());
      expect(dates[0]).toBeGreaterThanOrEqual(dates[1]);
      expect(dates[1]).toBeGreaterThanOrEqual(dates[2]);
    });
  });

  describe('updateContact', () => {
    it('should update contact successfully', async () => {
      const contactData = {
        name: 'Update Test',
        email: 'update@example.com',
        clinic: 'Original Clinic',
        specialty: 'Original Specialty',
        phone: '(11) 11111-1111'
      };

      const createdContact = await contactService.createContact(contactData);

      const updates = {
        name: 'Updated Name',
        clinic: 'Updated Clinic',
        status: 'contacted' as const
      };

      const updatedContact = await contactService.updateContact(
        (createdContact._id as any).toString(),
        updates
      );

      expect(updatedContact).toBeDefined();
      expect(updatedContact?.name).toBe(updates.name);
      expect(updatedContact?.clinic).toBe(updates.clinic);
      expect(updatedContact?.status).toBe(updates.status);
    });

    it('should return null for non-existent contact', async () => {
      const updates = { name: 'Test Update' };
      const result = await contactService.updateContact('507f1f77bcf86cd799439011', updates);

      expect(result).toBeNull();
    });
  });

  describe('deleteContact', () => {
    it('should delete contact successfully', async () => {
      const contactData = {
        name: 'Delete Test',
        email: 'delete@example.com',
        clinic: 'Delete Clinic',
        specialty: 'Delete Specialty',
        phone: '(11) 00000-0000'
      };

      const createdContact = await contactService.createContact(contactData);
      const deleteResult = await contactService.deleteContact((createdContact._id as any).toString());

      expect(deleteResult).toBe(true);

      // Verify contact is deleted
      const contact = await contactService.getContactById((createdContact._id as any).toString());
      expect(contact).toBeNull();
    });

    it('should return false for non-existent contact', async () => {
      const result = await contactService.deleteContact('507f1f77bcf86cd799439011');

      expect(result).toBe(false);
    });
  });

  describe('getContactStats', () => {
    beforeEach(async () => {
      // Create test contacts with different statuses
      await createTestContact({
        name: 'New Contact',
        email: 'new@example.com',
        status: 'new'
      });

      await createTestContact({
        name: 'Contacted Contact',
        email: 'contacted@example.com',
        status: 'contacted'
      });

      await createTestContact({
        name: 'Qualified Contact',
        email: 'qualified@example.com',
        status: 'qualified'
      });
    });

    it('should return contact statistics', async () => {
      const stats = await contactService.getContactStats();

      expect(stats.total).toBe(3);
      expect(stats.byStatus).toHaveLength(3);
      expect(stats.recentCount).toBe(3); // All contacts are recent in test

      // Check status counts
      const newStatus = stats.byStatus.find(s => s._id === 'new');
      const contactedStatus = stats.byStatus.find(s => s._id === 'contacted');
      const qualifiedStatus = stats.byStatus.find(s => s._id === 'qualified');

      expect(newStatus?.count).toBe(1);
      expect(contactedStatus?.count).toBe(1);
      expect(qualifiedStatus?.count).toBe(1);
    });
  });
});

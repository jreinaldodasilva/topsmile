import { Contact, IContact } from '../models/Contact';
import { FilterQuery } from 'mongoose';

export interface CreateContactData {
  name: string;
  email: string;
  clinic: string;
  specialty: string;
  phone: string;
  source?: string;
}

export interface ContactFilters {
  status?: string;
  source?: string;
  dateFrom?: Date;
  dateTo?: Date;
  search?: string;
}

export interface PaginationOptions {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ContactListResponse {
  contacts: IContact[];
  total: number;
  page: number;
  pages: number;
  limit: number;
}

class ContactService {
  async createContact(data: CreateContactData): Promise<IContact> {
    try {
      // Check if contact with same email already exists
      const existingContact = await Contact.findOne({ email: data.email });
      
      if (existingContact) {
        // Update existing contact with new information
        existingContact.name = data.name;
        existingContact.clinic = data.clinic;
        existingContact.specialty = data.specialty;
        existingContact.phone = data.phone;
        existingContact.status = 'new'; // Reset status to new
        existingContact.source = data.source || 'website_contact_form';
        
        return await existingContact.save();
      }

      // Create new contact
      const contact = new Contact(data);
      return await contact.save();
    } catch (error) {
      console.error('Error creating contact:', error);
      throw error;
    }
  }

  async getContactById(id: string): Promise<IContact | null> {
    try {
      return await Contact.findById(id).populate('assignedTo', 'name email');
    } catch (error) {
      console.error('Error fetching contact:', error);
      throw error;
    }
  }

  async getContacts(
    filters: ContactFilters = {},
    pagination: PaginationOptions
  ): Promise<ContactListResponse> {
    try {
      const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = pagination;
      const skip = (page - 1) * limit;

      // Build query
      const query: FilterQuery<IContact> = {};

      if (filters.status) {
        query.status = filters.status;
      }

      if (filters.source) {
        query.source = filters.source;
      }

      if (filters.dateFrom || filters.dateTo) {
        query.createdAt = {};
        if (filters.dateFrom) {
          query.createdAt.$gte = filters.dateFrom;
        }
        if (filters.dateTo) {
          query.createdAt.$lte = filters.dateTo;
        }
      }

      if (filters.search) {
        query.$or = [
          { name: { $regex: filters.search, $options: 'i' } },
          { email: { $regex: filters.search, $options: 'i' } },
          { clinic: { $regex: filters.search, $options: 'i' } },
          { specialty: { $regex: filters.search, $options: 'i' } }
        ];
      }

      // Execute query with pagination
      const [contacts, total] = await Promise.all([
        Contact.find(query)
          .populate('assignedTo', 'name email')
          .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
          .skip(skip)
          .limit(limit),
        Contact.countDocuments(query)
      ]);

      const pages = Math.ceil(total / limit);

      return {
        contacts,
        total,
        page,
        pages,
        limit
      };
    } catch (error) {
      console.error('Error fetching contacts:', error);
      throw error;
    }
  }

  async updateContact(id: string, updates: Partial<IContact>): Promise<IContact | null> {
    try {
      return await Contact.findByIdAndUpdate(
        id,
        updates,
        { new: true, runValidators: true }
      ).populate('assignedTo', 'name email');
    } catch (error) {
      console.error('Error updating contact:', error);
      throw error;
    }
  }

  async deleteContact(id: string): Promise<boolean> {
    try {
      const result = await Contact.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      console.error('Error deleting contact:', error);
      throw error;
    }
  }

  async getContactStats(): Promise<{
    total: number;
    byStatus: Array<{ _id: string; count: number }>;
    bySource: Array<{ _id: string; count: number }>;
    recentCount: number;
  }> {
    try {
      const today = new Date();
      const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

      const [total, byStatus, bySource, recentCount] = await Promise.all([
        Contact.countDocuments(),
        Contact.aggregate([
          { $group: { _id: '$status', count: { $sum: 1 } } },
          { $sort: { count: -1 } }
        ]),
        Contact.aggregate([
          { $group: { _id: '$source', count: { $sum: 1 } } },
          { $sort: { count: -1 } }
        ]),
        Contact.countDocuments({ createdAt: { $gte: lastWeek } })
      ]);

      return {
        total,
        byStatus,
        bySource,
        recentCount
      };
    } catch (error) {
      console.error('Error fetching contact stats:', error);
      throw error;
    }
  }
}

export const contactService = new ContactService();

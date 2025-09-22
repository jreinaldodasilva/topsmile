import { Contact as IContact, ContactFilters, ContactListResponse } from '@topsmile/types';
import { Contact as ContactModel } from '../models/Contact';
import { FilterQuery } from 'mongoose';
import { AuthenticatedRequest } from '../middleware/auth';

export interface CreateContactData {
  name: string;
  email: string;
  clinic: string;
  specialty: string;
  phone: string;
  source?: string;
  priority?: 'low' | 'medium' | 'high';
  leadScore?: number;
  metadata?: {
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
    utmTerm?: string;
    utmContent?: string;
    referrer?: string;
    ipAddress?: string;
    userAgent?: string;
  };
}

export interface PaginationOptions {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

class ContactService {
  /**
   * FIXED: Create contact with atomic operation to prevent race conditions
   */
  async createContact(data: CreateContactData): Promise<IContact> {
    try {
      // FIXED: Use findOneAndUpdate with upsert for atomic operation
      // This prevents race conditions between check and create/update
      const updatedContact = await ContactModel.findOneAndUpdate(
        { email: data.email }, // Find by email
        {
          $set: {
            name: data.name,
            clinic: data.clinic,
            specialty: data.specialty,
            phone: data.phone,
            status: 'new', // Reset status to new for existing contacts
            source: data.source || 'website_contact_form',
            priority: data.priority || 'medium',
            leadScore: data.leadScore || 50,
            metadata: data.metadata || {}
          }
        },
        { 
          new: true,                 // Return the updated document
          upsert: true,              // Create if doesn't exist
          runValidators: true,       // Run schema validators
          setDefaultsOnInsert: true  // Set default values when creating
        }
      );

      return updatedContact as IContact;
    } catch (error) {
      console.error('Error creating contact:', error);
      throw error;
    }
  }

  /**
   * IMPROVED: Create contact with better error handling and validation
   */
  async createContactSafe(data: CreateContactData): Promise<{
    contact: IContact;
    isNew: boolean;
    message: string;
  }> {
    try {
      // Validate required fields
      if (!data.email || !data.name || !data.clinic || !data.specialty) {
        throw new Error('Campos obrigatórios não fornecidos');
      }

      // Check if contact exists first to determine if it's new or updated
      const existingContact = await ContactModel.findOne({ email: data.email }).lean();
      const isNew = !existingContact;

      // Use atomic operation
      const updatedContact = await ContactModel.findOneAndUpdate(
        { email: data.email },
        {
          $set: {
            name: data.name,
            clinic: data.clinic,
            specialty: data.specialty,
            phone: data.phone,
            source: data.source || 'website_contact_form',
            ...(existingContact ? { status: 'new' } : {}) // Only reset status if updating
          }
        },
        { 
          new: true,
          upsert: true,
          runValidators: true,
          setDefaultsOnInsert: true
        }
      );

      return {
        contact: updatedContact,
        isNew,
        message: isNew ? 'Contato criado com sucesso' : 'Contato atualizado com sucesso'
      };
    } catch (error) {
      console.error('Error creating contact safely:', error);
      throw error;
    }
  }

  /**
   * ADDED: Batch create contacts with atomic operations
   */
  async createMultipleContacts(contactsData: CreateContactData[]): Promise<{
    created: number;
    updated: number;
    failed: Array<{ email: string; error: string }>;
    contacts: IContact[];
  }> {
    const results = {
      created: 0,
      updated: 0,
      failed: [] as Array<{ email: string; error: string }>,
      contacts: [] as IContact[]
    };

    for (const data of contactsData) {
      try {
        const result = await this.createContactSafe(data);
        
        if (result.isNew) {
          results.created++;
        } else {
          results.updated++;
        }
        
        results.contacts.push(result.contact);
      } catch (error) {
        results.failed.push({
          email: data.email,
          error: error instanceof Error ? error.message : 'Erro desconhecido'
        });
      }
    }

    return results;
  }

  async getContactById(user: AuthenticatedRequest['user'], id: string): Promise<IContact | null> {
    try {
      const contact = await ContactModel.findById(id).populate('assignedTo', 'name email') as IContact | null;
      if (contact && user?.role !== 'super_admin' && String(contact.assignedToClinic) !== user?.clinicId) {
        return null;
      }
      return contact;
    } catch (error) {
      console.error('Error fetching contact:', error);
      throw error;
    }
  }

  /**
   * IMPROVED: Get contact by email with better error handling
   */
  async getContactByEmail(email: string): Promise<IContact | null> {
    try {
      if (!email) {
        throw new Error('E-mail é obrigatório');
      }

      return await ContactModel.findOne({ email: email.toLowerCase().trim() })
        .populate('assignedTo', 'name email') as IContact | null;
    } catch (error) {
      console.error('Error fetching contact by email:', error);
      throw error;
    }
  }

  async getContacts(
    user: AuthenticatedRequest['user'],
    filters: ContactFilters = {},
    pagination: PaginationOptions
  ): Promise<ContactListResponse> {
    try {
      const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = pagination;
      const skip = (page - 1) * limit;

      // Build query
      const query: FilterQuery<IContact> = {};

      if (user?.role !== 'super_admin') {
        query.assignedToClinic = user?.clinicId;
      }

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
        ContactModel.find(query)
          .populate('assignedTo', 'name email')
          .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
          .skip(skip)
          .limit(limit),
        ContactModel.countDocuments(query)
      ]);

      const pages = Math.ceil(total / limit);

      return {
        contacts: contacts as IContact[],
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

  /**
   * IMPROVED: Update contact with atomic operation
   */
  async updateContact(id: string, updates: Partial<IContact>): Promise<IContact | null> {
    try {
      // Remove fields that shouldn't be updated directly
      const { _id, createdAt, updatedAt, ...safeUpdates } = updates as any;

      return await ContactModel.findByIdAndUpdate(
        id,
        { $set: safeUpdates },
        {
          new: true,
          runValidators: true,
          upsert: false // Don't create if doesn't exist
        }
      ).populate('assignedTo', 'name email') as IContact | null;
    } catch (error) {
      console.error('Error updating contact:', error);
      throw error;
    }
  }

  /**
   * IMPROVED: Batch update contacts
   */
  async updateContactStatus(
    contactIds: string[],
    status: IContact['status'],
    assignedTo?: string
  ): Promise<{ modifiedCount: number; matchedCount: number }> {
    try {
      const updateData: any = { status };
      
      if (assignedTo) {
        updateData.assignedTo = assignedTo;
      }

      const result = await ContactModel.updateMany(
        { _id: { $in: contactIds } },
        { $set: updateData },
        { runValidators: true }
      );

      return {
        modifiedCount: result.modifiedCount,
        matchedCount: result.matchedCount
      };
    } catch (error) {
      console.error('Error updating contact status:', error);
      throw error;
    }
  }

  async deleteContact(id: string): Promise<boolean> {
    try {
      const result = await ContactModel.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      console.error('Error deleting contact:', error);
      throw error;
    }
  }

  /**
   * IMPROVED: Soft delete with atomic operation
   */
  async softDeleteContact(id: string, deletedBy?: string): Promise<IContact | null> {
    try {
      return await ContactModel.findByIdAndUpdate(
        id,
        {
          $set: {
            status: 'deleted',
            deletedAt: new Date(),
            deletedBy: deletedBy
          }
        },
        { new: true, runValidators: true }
      ) as IContact | null;
    } catch (error) {
      console.error('Error soft deleting contact:', error);
      throw error;
    }
  }

  /**
   * IMPROVED: Get contact stats with better aggregation
   */
  async getContactStats(user: AuthenticatedRequest['user']): Promise<{
    total: number;
    byStatus: Array<{ _id: string; count: number }>;
    bySource: Array<{ _id: string; count: number }>;
    recentCount: number;
    monthlyTrend: Array<{ month: string; count: number }>;
  }> {
    try {
      const today = new Date();
      const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      const lastYear = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());

      const matchQuery: FilterQuery<IContact> = { status: { $ne: 'deleted' } };
      if (user?.role !== 'super_admin') {
        matchQuery.assignedToClinic = user?.clinicId;
      }

      const [total, byStatus, bySource, recentCount, monthlyTrend] = await Promise.all([
        // Total contacts (excluding deleted)
        ContactModel.countDocuments(matchQuery),
        
        // By status
        ContactModel.aggregate([
          { $match: matchQuery },
          { $group: { _id: '$status', count: { $sum: 1 } } },
          { $sort: { count: -1 } }
        ]),
        
        // By source
        ContactModel.aggregate([
          { $match: matchQuery },
          { $group: { _id: '$source', count: { $sum: 1 } } },
          { $sort: { count: -1 } }
        ]),
        
        // Recent count (last week)
        ContactModel.countDocuments({ 
          ...matchQuery,
          createdAt: { $gte: lastWeek }
        }),
        
        // Monthly trend (last 12 months)
        ContactModel.aggregate([
          {
            $match: {
              ...matchQuery,
              createdAt: { $gte: lastYear }
            }
          },
          {
            $group: {
              _id: {
                year: { $year: '$createdAt' },
                month: { $month: '$createdAt' }
              },
              count: { $sum: 1 }
            }
          },
          {
            $project: {
              month: {
                $concat: [
                  { $toString: '$_id.year' },
                  '-',
                  { $toString: '$_id.month' }
                ]
              },
              count: 1,
              _id: 0
            }
          },
          { $sort: { '_id.year': 1, '_id.month': 1 } }
        ])
      ]);

      return {
        total,
        byStatus,
        bySource,
        recentCount,
        monthlyTrend
      };
    } catch (error) {
      console.error('Error fetching contact stats:', error);
      throw error;
    }
  }

  /**
   * ADDED: Find duplicate contacts by email
   */
  async findDuplicateContacts(): Promise<Array<{
    email: string;
    contacts: IContact[];
    count: number;
  }>> {
    try {
      const duplicates = await ContactModel.aggregate([
        {
          $match: { status: { $ne: 'deleted' } }
        },
        {
          $group: {
            _id: '$email',
            contacts: { $push: '$$ROOT' },
            count: { $sum: 1 }
          }
        },
        {
          $match: { count: { $gt: 1 } }
        },
        {
          $project: {
            email: '$_id',
            contacts: 1,
            count: 1,
            _id: 0
          }
        },
        {
          $sort: { count: -1 }
        }
      ]);

      return duplicates.map(d => ({
        email: d.email,
        contacts: d.contacts as IContact[],
        count: d.count
      }));
    } catch (error) {
      console.error('Error finding duplicate contacts:', error);
      throw error;
    }
  }

  /**
   * ADDED: Merge duplicate contacts
   */
  async mergeDuplicateContacts(
    primaryContactModelId: string,
    duplicateContactIds: string[]
  ): Promise<IContact> {
    try {
      // Get the primary contact
      const primaryContactModel = await ContactModel.findById(primaryContactModelId);
      if (!primaryContactModel) {
        throw new Error('Contato principal não encontrado');
      }

      // Get duplicate contacts to merge data
      const duplicateContacts = await ContactModel.find({
        _id: { $in: duplicateContactIds }
      });

      // Merge data (you can customize this logic based on business rules)
      const mergedData: any = {};

      // Collect all sources
      const sources = [primaryContactModel.source, ...duplicateContacts.map(c => c.source)]
        .filter(Boolean);
      if (sources.length > 0) {
        mergedData.source = sources.join(', ');
      }

      // Use most recent data for other fields
      const allContacts = [primaryContactModel, ...duplicateContacts]
        .sort((a, b) => (b.updatedAt as Date).getTime() - (a.updatedAt as Date).getTime());

      const mostRecent = allContacts[0];
      if (mostRecent) {
        mergedData.name = mostRecent.name;
        mergedData.phone = mostRecent.phone;
        mergedData.clinic = mostRecent.clinic;
        mergedData.specialty = mostRecent.specialty;
      }

      // Update primary contact with merged data
      const updatedContact = await ContactModel.findByIdAndUpdate(
        primaryContactModelId,
        { $set: mergedData },
        { new: true, runValidators: true }
      );

      // Soft delete duplicate contacts
      await ContactModel.updateMany(
        { _id: { $in: duplicateContactIds } },
        { 
          $set: { 
            status: 'merged',
            mergedInto: primaryContactModelId,
            deletedAt: new Date()
          }
        }
      );

      return updatedContact as IContact;
    } catch (error) {
      console.error('Error merging duplicate contacts:', error);
      throw error;
    }
  }
}

export const contactService = new ContactService();
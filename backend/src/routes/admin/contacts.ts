import express, { Request, Response } from 'express';
import { authenticate, authorize, AuthenticatedRequest } from '../../middleware/auth';
import { contactService } from '../../services/contactService';

const router: express.Router = express.Router();

// GET /api/admin/contacts - List contacts with pagination and filtering
router.get('/', authenticate, authorize('super_admin', 'admin', 'manager'), async (req: Request, res: Response) => {
  const authReq = req as unknown as AuthenticatedRequest;
  try {
    const page = parseInt(authReq.query.page as string) || 1;
    const limit = Math.min(parseInt(authReq.query.limit as string) || 10, 100); // Max 100 per page
    const status = authReq.query.status as string;
    const search = authReq.query.search as string;
    const sortBy = authReq.query.sortBy as string || 'createdAt';
    const sortOrder = authReq.query.sortOrder as 'asc' | 'desc' || 'desc';

    const filters: any = {};
    if (status) filters.status = status;
    if (search) filters.search = search;

    const result = await contactService.getContacts(authReq.user, filters, {
      page,
      limit,
      sortBy,
      sortOrder
    });

    return res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao buscar contatos'
    });
  }
});

// GET /api/admin/contacts/stats - Get contact statistics
router.get('/stats', authenticate, authorize('super_admin', 'admin', 'manager'), async (req: Request, res: Response) => {
  const authReq = req as unknown as AuthenticatedRequest;
  try {
    const stats = await contactService.getContactStats(authReq.user);
    return res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching contact stats:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao buscar estatísticas'
    });
  }
});

// GET /api/admin/contacts/:id - Get single contact
router.get('/:id', authenticate, authorize('super_admin', 'admin', 'manager'), async (req: Request, res: Response) => {
  const authReq = req as unknown as AuthenticatedRequest;
  try {
    const contact = await contactService.getContactById(authReq.user, authReq.params.id!);
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contato não encontrado'
      });
    }
    return res.json({
      success: true,
      data: contact
    });
  } catch (error) {
    console.error('Error fetching contact:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao buscar contato'
    });
  }
});

// PATCH /api/admin/contacts/:id - Update contact
router.patch('/:id', authenticate, authorize('super_admin', 'admin', 'manager'), async (req: Request, res: Response) => {
  const authReq = req as unknown as AuthenticatedRequest;
  try {
    const updates = req.body;

    // Add assignedTo if updating status and user is not super_admin
    if (updates.status && authReq.user && authReq.user.role !== 'super_admin') {
      updates.assignedTo = authReq.user.id;
      updates.assignedToClinic = authReq.user.clinicId;
    }

    const contact = await contactService.updateContact(authReq.params.id!, updates);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contato não encontrado'
      });
    }

    return res.json({
      success: true,
      data: contact
    });
  } catch (error) {
    console.error('Error updating contact:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao atualizar contato'
    });
  }
});

// DELETE /api/admin/contacts/:id - Delete contact
router.delete('/:id', authenticate, authorize('super_admin', 'admin'), async (req: Request, res: Response) => {
  const authReq = req as unknown as AuthenticatedRequest;
  try {
    const deleted = await contactService.deleteContact(authReq.params.id!);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Contato não encontrado'
      });
    }

    return res.json({
      success: true,
      message: 'Contato excluído com sucesso'
    });
  } catch (error) {
    console.error('Error deleting contact:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao excluir contato'
    });
  }
});

// POST /api/admin/contacts/batch/status - Batch update contact status
router.post('/batch/status', authenticate, authorize('super_admin', 'admin', 'manager'), async (req: Request, res: Response) => {
  const authReq = req as unknown as AuthenticatedRequest;
  try {
    const { contactIds, status, assignedTo } = authReq.body;

    if (!contactIds || !Array.isArray(contactIds) || contactIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'IDs dos contatos são obrigatórios'
      });
    }

    if (!status || !['new', 'contacted', 'qualified', 'converted', 'lost', 'deleted'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status inválido'
      });
    }

    const result = await contactService.updateContactStatus(contactIds, status, assignedTo);

    return res.json({
      success: true,
      message: `${result.modifiedCount} contatos atualizados com sucesso`,
      data: result
    });
  } catch (error) {
    console.error('Error batch updating contacts:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao atualizar contatos em lote'
    });
  }
});

// GET /api/admin/contacts/duplicates - Find duplicate contacts
router.get('/duplicates', authenticate, authorize('super_admin', 'admin'), async (req: Request, res: Response) => {
  try {
    const duplicates = await contactService.findDuplicateContacts();

    return res.json({
      success: true,
      data: duplicates
    });
  } catch (error) {
    console.error('Error finding duplicate contacts:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao buscar contatos duplicados'
    });
  }
});

// POST /api/admin/contacts/merge - Merge duplicate contacts
router.post('/merge', authenticate, authorize('super_admin', 'admin'), async (req: Request, res: Response) => {
  const authReq = req as unknown as AuthenticatedRequest;
  try {
    const { primaryContactId, duplicateContactIds } = authReq.body;

    if (!primaryContactId || !duplicateContactIds || !Array.isArray(duplicateContactIds)) {
      return res.status(400).json({
        success: false,
        message: 'ID do contato principal e IDs dos duplicados são obrigatórios'
      });
    }

    const mergedContact = await contactService.mergeDuplicateContacts(primaryContactId, duplicateContactIds);

    return res.json({
      success: true,
      message: 'Contatos mesclados com sucesso',
      data: mergedContact
    });
  } catch (error) {
    console.error('Error merging contacts:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao mesclar contatos'
    });
  }
});

export default router;

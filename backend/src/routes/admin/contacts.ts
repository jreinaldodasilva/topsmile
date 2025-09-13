import express, { Request, Response } from 'express';
import { authenticate, authorize, AuthenticatedRequest } from '../../middleware/auth';
import { contactService } from '../../services/contactService';

const router = express.Router();

// GET /api/admin/contacts - List contacts with pagination and filtering
router.get('/', authenticate, authorize('super_admin', 'admin', 'manager'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(parseInt(req.query.limit as string) || 10, 100); // Max 100 per page
    const status = req.query.status as string;
    const search = req.query.search as string;
    const sortBy = req.query.sortBy as string || 'createdAt';
    const sortOrder = req.query.sortOrder as 'asc' | 'desc' || 'desc';

    const filters: any = {};
    if (status) filters.status = status;
    if (search) filters.search = search;

    const result = await contactService.getContacts(filters, {
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
router.get('/stats', authenticate, authorize('super_admin', 'admin', 'manager'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const stats = await contactService.getContactStats();
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
router.get('/:id', authenticate, authorize('super_admin', 'admin', 'manager'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const contact = await contactService.getContactById(req.params.id!);
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
router.patch('/:id', authenticate, authorize('super_admin', 'admin', 'manager'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const updates = req.body;

    // Add assignedTo if updating status and user is not super_admin
    if (updates.status && req.user && req.user.role !== 'super_admin') {
      updates.assignedTo = req.user.id;
      updates.assignedToClinic = req.user.clinicId;
    }

    const contact = await contactService.updateContact(req.params.id!, updates);

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
router.delete('/:id', authenticate, authorize('super_admin', 'admin'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const deleted = await contactService.deleteContact(req.params.id!);

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

export default router;

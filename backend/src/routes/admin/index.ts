import express, { Request, Response } from 'express';
import { authenticate, authorize, AuthenticatedRequest } from '../../middleware/auth/auth';
import { contactService } from '../../services/admin/contactService';
import contactRoutes from './contacts';
import analyticsRoutes from './analytics';
import roleManagementRoutes from './roleManagement';

const router: express.Router = express.Router();

// Mount admin sub-routes
router.use('/contacts', contactRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/role-management', roleManagementRoutes);

// Dashboard stats endpoint
router.get('/dashboard', authenticate, authorize('super_admin', 'admin', 'manager'), async (req: Request, res: Response) => {
  try {
    const authReq = req as unknown as AuthenticatedRequest;
    // Get contact statistics
    const contactStats = await contactService.getContactStats(authReq.user);

    // Calculate summary metrics
    const totalContacts = contactStats.total;
    const newThisWeek = contactStats.recentCount;
    const convertedCount = contactStats.byStatus.find(s => s._id === 'converted')?.count || 0;
    const conversionRate = totalContacts > 0 ? (convertedCount / totalContacts) : 0;

    // Mock other stats for now (these would come from other services)
    const revenue = '0'; // This would come from billing/invoice service

    const dashboardData = {
      contacts: contactStats,
      summary: {
        totalContacts,
        newThisWeek,
        conversionRate,
        revenue
      },
      user: {
        name: authReq.user?.name || 'Usuário',
        role: authReq.user?.role || 'admin',
        clinicId: authReq.user?.clinicId || null,
        lastActivity: new Date().toISOString()
      }
    };

    return res.json({
      success: true,
      data: dashboardData
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao buscar estatísticas do dashboard'
    });
  }
});

// Add other admin routes here as they are created
// router.use('/users', userRoutes);
// router.use('/clinics', clinicRoutes);
// router.use('/reports', reportRoutes);

export default router;

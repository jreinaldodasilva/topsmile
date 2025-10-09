// backend/src/routes/v1/index.ts
import { Router } from 'express';
import authRoutes from '../auth';
import patientAuthRoutes from '../patient/patientAuth';
import clinicalRoutes from '../clinical';
import schedulingRoutes from '../scheduling';
import patientRoutes from '../patient';
import securityRoutes from '../security';
import providerRoutes from '../provider';
import adminRoutes from '../admin';
import publicRoutes from '../public';
import { authenticate } from '../../middleware/auth/auth';

const router: Router = Router();

router.use('/auth', authRoutes);
router.use('/patient-auth', patientAuthRoutes);
router.use('/clinical', authenticate, clinicalRoutes);
router.use('/scheduling', authenticate, schedulingRoutes);
router.use('/patients', authenticate, patientRoutes);
router.use('/security', authenticate, securityRoutes);
router.use('/providers', providerRoutes);
router.use('/admin', authenticate, adminRoutes);
router.use('/public', publicRoutes);

export default router;

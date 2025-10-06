// backend/src/routes/patient/index.ts
import { Router } from 'express';
import patientsRoutes from './patients';
import patientAuthRoutes from './patientAuth';
import medicalHistoryRoutes from './medicalHistory';
import insuranceRoutes from './insurance';
import familyRoutes from './family';
import documentsRoutes from './documents';

const router: Router = Router();

router.use('/auth', patientAuthRoutes);
router.use('/', patientsRoutes);
router.use('/medical-history', medicalHistoryRoutes);
router.use('/insurance', insuranceRoutes);
router.use('/family', familyRoutes);
router.use('/documents', documentsRoutes);

export default router;

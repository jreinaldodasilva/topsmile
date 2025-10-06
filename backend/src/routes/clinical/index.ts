// backend/src/routes/clinical/index.ts
import { Router } from 'express';
import dentalChartsRoutes from './dentalCharts';
import clinicalNotesRoutes from './clinicalNotes';
import prescriptionsRoutes from './prescriptions';
import treatmentPlansRoutes from './treatmentPlans';

const router: Router = Router();

router.use('/dental-charts', dentalChartsRoutes);
router.use('/clinical-notes', clinicalNotesRoutes);
router.use('/prescriptions', prescriptionsRoutes);
router.use('/treatment-plans', treatmentPlansRoutes);

export default router;

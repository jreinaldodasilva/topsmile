// backend/src/routes/public/index.ts
import { Router } from 'express';
import contactRoutes from './contact';
import consentFormsRoutes from './consentForms';
import formsRoutes from './forms';
import docsRoutes from './docs';
import clinicsRoutes from './clinics';

const router: Router = Router();

router.use('/contact', contactRoutes);
router.use('/consent-forms', consentFormsRoutes);
router.use('/forms', formsRoutes);
router.use('/docs', docsRoutes);
router.use('/clinics', clinicsRoutes);

export default router;

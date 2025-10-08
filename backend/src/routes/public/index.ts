// backend/src/routes/public/index.ts
import { Router } from 'express';
import contactRoutes from './contact';
import consentFormsRoutes from './consentForms';
import formsRoutes from './forms';
import docsRoutes from './docs';

const router: Router = Router();

router.use('/contact', contactRoutes);
router.use('/consent-forms', consentFormsRoutes);
router.use('/forms', formsRoutes);
router.use('/docs', docsRoutes);

export default router;

// backend/src/routes/provider/index.ts
import { Router } from 'express';
import providersRoutes from './providers';

const router: Router = Router();

router.use('/', providersRoutes);

export default router;

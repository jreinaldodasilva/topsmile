// backend/src/routes/scheduling/index.ts
import { Router } from 'express';
import appointmentsRoutes from './appointments';
import calendarRoutes from './calendar';
import operatoriesRoutes from './operatories';
import waitlistRoutes from './waitlist';
import bookingRoutes from './booking';

const router: Router = Router();

router.use('/appointments', appointmentsRoutes);
router.use('/calendar', calendarRoutes);
router.use('/operatories', operatoriesRoutes);
router.use('/waitlist', waitlistRoutes);
router.use('/booking', bookingRoutes);

export default router;

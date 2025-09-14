import express from 'express';
import contactRoutes from './contacts';

const router = express.Router();

// Mount admin sub-routes
router.use('/contacts', contactRoutes);

// Add other admin routes here as they are created
// router.use('/users', userRoutes);
// router.use('/clinics', clinicRoutes);
// router.use('/reports', reportRoutes);

export default router;

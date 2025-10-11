import logger from '../../utils/logger';
// backend/src/routes/analytics.ts
import express, { Request, Response, Router } from 'express';

const router: Router = express.Router();

router.post('/vitals', async (req: Request, res: Response) => {
    try {
        const { name, value, rating, delta, id } = req.body;
        
        logger.info({ name, value, rating, delta, id }, 'Web Vital');
        
        // TODO: Store in database or send to analytics service
        
        return res.status(200).json({ success: true });
    } catch (error) {
        logger.error({ error }, 'Error logging web vital:');
        return res.status(500).json({ success: false });
    }
});

export default router;

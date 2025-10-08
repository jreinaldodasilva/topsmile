// backend/src/routes/security/index.ts
import { Router } from 'express';
import mfaRoutes from './mfa';
import smsVerificationRoutes from './smsVerification';
import passwordPolicyRoutes from './passwordPolicy';
import sessionsRoutes from './sessions';
import auditLogsRoutes from './auditLogs';
import permissionsRoutes from './permissions';

const router: Router = Router();

router.use('/mfa', mfaRoutes);
router.use('/sms-verification', smsVerificationRoutes);
router.use('/password-policy', passwordPolicyRoutes);
router.use('/sessions', sessionsRoutes);
router.use('/audit-logs', auditLogsRoutes);
router.use('/permissions', permissionsRoutes);

export default router;

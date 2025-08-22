// backend/src/routes/forms.ts
import { Router } from 'express';
import { FormTemplate, FormResponse } from '../models/FormTemplate';
import { body, validationResult } from 'express-validator';

const router = Router();

router.post('/templates', body('title').notEmpty(), body('questions').isArray(), async (req, res) => {
  const errs = validationResult(req); if (!errs.isEmpty()) return res.status(400).json({ errors: errs.array() });
  const tpl = new FormTemplate(req.body);
  await tpl.save();
  return res.json(tpl);
});

router.get('/templates/:id', async (req, res) => {
  try {
    const template = await FormTemplate.findById(req.params.id);
    if (!template) {
      return res.status(404).json({ error: 'Template not found' });
    }
    return res.json(template);
  } catch (error) {
    return res.status(500).json({ error: 'Server error' });
  }
});

router.post('/responses', body('templateId').isMongoId(), body('patientId').isMongoId(), body('answers').isObject(), async (req, res) => {
  const errs = validationResult(req); if (!errs.isEmpty()) return res.status(400).json({ errors: errs.array() });
  const resp = new FormResponse(req.body);
  await resp.save();
  return res.json(resp);
});

export default router;

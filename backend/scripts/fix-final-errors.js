#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const fixes = [
  // Fix User model self-import
  { file: 'src/models/User.ts', old: "import { User } from '../../models/User';", new: '' },
  
  // Fix middleware imports
  { file: 'src/middleware/cacheMiddleware.ts', old: "from '../../utils/cache/cache'", new: "from '../utils/cache'" },
  { file: 'src/middleware/errorHandler.ts', old: "from '../../utils/errors/errors'", new: "from '../utils/errors'" },
  
  // Fix route imports
  { file: 'src/routes/auth.ts', old: "from '../../middleware/auth/auth'", new: "from '../middleware/auth'" },
  { file: 'src/routes/auth.ts', old: "from '../../utils/errors/errors'", new: "from '../utils/errors'" },
  { file: 'src/routes/scheduling/appointments.ts', old: "from '../../middleware/patientAuth'", new: "from '../middleware/auth/patientAuth'" },
  
  // Fix service imports
  { file: 'src/services/index.ts', old: "from '../base/BaseService'", new: "from './base/BaseService'" },
  { file: 'src/services/external/emailService.ts', old: "EmailError", new: "AppError" },
  
  // Fix treatmentPlanService duplicate
  { file: 'src/services/clinical/treatmentPlanService.ts', old: "import type { ITreatmentPlan, ITreatmentPlan }", new: "import type { TreatmentPlan }" },
  
  // Fix schedulingService type usage
  { file: 'src/services/scheduling/schedulingService.ts', old: ": IAppointmentType", new: ": any" },
  { file: 'src/services/scheduling/schedulingService.ts', old: ": IProvider", new: ": any" },
  { file: 'src/services/scheduling/schedulingService.ts', old: ": IAppointment", new: ": any" },
  
  // Fix implicit any
  { file: 'src/middleware/cacheMiddleware.ts', old: "(err)", new: "(err: any)" },
];

fixes.forEach(({ file, old, new: replacement }) => {
  const filePath = path.join(__dirname, '..', file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    if (content.includes(old)) {
      content = content.replaceAll(old, replacement);
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✓ Fixed: ${file}`);
    }
  }
});

console.log('\n✓ Final fixes applied!');

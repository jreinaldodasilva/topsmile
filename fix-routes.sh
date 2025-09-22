#!/bin/bash

# Fix all route handlers to use Request type instead of AuthenticatedRequest

# Fix appointments.ts
sed -i 's/async (req: AuthenticatedRequest, res/async (req: Request, res/g' /home/rebelde/development/topsmile/backend/src/routes/appointments.ts
sed -i 's/req\.user/authReq.user/g' /home/rebelde/development/topsmile/backend/src/routes/appointments.ts
sed -i '/async (req: Request, res/a\  const authReq = req as AuthenticatedRequest;' /home/rebelde/development/topsmile/backend/src/routes/appointments.ts

# Fix appointmentTypes.ts
sed -i 's/async (req: AuthenticatedRequest, res/async (req: Request, res/g' /home/rebelde/development/topsmile/backend/src/routes/appointmentTypes.ts
sed -i 's/req\.user/authReq.user/g' /home/rebelde/development/topsmile/backend/src/routes/appointmentTypes.ts
sed -i '/async (req: Request, res/a\  const authReq = req as AuthenticatedRequest;' /home/rebelde/development/topsmile/backend/src/routes/appointmentTypes.ts

# Fix auth.ts
sed -i 's/async (req: AuthenticatedRequest, res/async (req: Request, res/g' /home/rebelde/development/topsmile/backend/src/routes/auth.ts
sed -i 's/req\.user/authReq.user/g' /home/rebelde/development/topsmile/backend/src/routes/auth.ts
sed -i '/async (req: Request, res/a\  const authReq = req as AuthenticatedRequest;' /home/rebelde/development/topsmile/backend/src/routes/auth.ts

# Fix forms.ts
sed -i 's/async (req: AuthenticatedRequest, res/async (req: Request, res/g' /home/rebelde/development/topsmile/backend/src/routes/forms.ts
sed -i 's/req\.user/authReq.user/g' /home/rebelde/development/topsmile/backend/src/routes/forms.ts
sed -i '/async (req: Request, res/a\  const authReq = req as AuthenticatedRequest;' /home/rebelde/development/topsmile/backend/src/routes/forms.ts

# Fix patients.ts
sed -i 's/async (req: AuthenticatedRequest, res/async (req: Request, res/g' /home/rebelde/development/topsmile/backend/src/routes/patients.ts
sed -i 's/req\.user/authReq.user/g' /home/rebelde/development/topsmile/backend/src/routes/patients.ts
sed -i '/async (req: Request, res/a\  const authReq = req as AuthenticatedRequest;' /home/rebelde/development/topsmile/backend/src/routes/patients.ts

# Fix providers.ts
sed -i 's/async (req: AuthenticatedRequest, res/async (req: Request, res/g' /home/rebelde/development/topsmile/backend/src/routes/providers.ts
sed -i 's/req\.user/authReq.user/g' /home/rebelde/development/topsmile/backend/src/routes/providers.ts
sed -i '/async (req: Request, res/a\  const authReq = req as AuthenticatedRequest;' /home/rebelde/development/topsmile/backend/src/routes/providers.ts

echo "Route handlers fixed!"
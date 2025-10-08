#!/bin/bash

# Refactor test suite to match new backend structure

echo "Refactoring test suite..."

# Create new test directory structure
mkdir -p tests/unit/services/{auth,clinical,external,patient,scheduling,admin,provider}
mkdir -p tests/unit/middleware/{auth,security,validation}
mkdir -p tests/unit/utils/{errors,cache,validation}
mkdir -p tests/integration/routes/{admin,clinical,patient,provider,public,scheduling,security}

# Move service tests
[ -f tests/unit/services/auth.test.ts ] && mv tests/unit/services/auth.test.ts tests/unit/services/auth/
[ -f tests/unit/services/appointmentService.test.ts ] && mv tests/unit/services/appointmentService.test.ts tests/unit/services/scheduling/
[ -f tests/unit/services/appointment.test.ts ] && mv tests/unit/services/appointment.test.ts tests/unit/services/scheduling/
[ -f tests/unit/services/patientService.test.ts ] && mv tests/unit/services/patientService.test.ts tests/unit/services/patient/
[ -f tests/unit/services/patient.test.ts ] && mv tests/unit/services/patient.test.ts tests/unit/services/patient/
[ -f tests/unit/services/providerService.test.ts ] && mv tests/unit/services/providerService.test.ts tests/unit/services/provider/

# Move middleware tests
[ -f tests/unit/middleware/auth.test.ts ] && mv tests/unit/middleware/auth.test.ts tests/unit/middleware/auth/

# Move utils tests
[ -f tests/unit/errors.test.ts ] && mv tests/unit/errors.test.ts tests/unit/utils/errors/
[ -f tests/unit/cache.test.ts ] && mv tests/unit/cache.test.ts tests/unit/utils/cache/
[ -f tests/unit/pagination.test.ts ] && mv tests/unit/pagination.test.ts tests/unit/utils/validation/

# Move integration route tests
[ -f tests/integration/routes/appointments.test.ts ] && mv tests/integration/routes/appointments.test.ts tests/integration/routes/scheduling/
[ -f tests/integration/routes/patients.test.ts ] && mv tests/integration/routes/patients.test.ts tests/integration/routes/patient/
[ -f tests/integration/routes/auth.test.ts ] && mv tests/integration/routes/auth.test.ts tests/integration/routes/security/

echo "Test suite refactoring complete!"

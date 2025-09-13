# Backend Implementation Plan 03

This document outlines the plan for implementing the recommendations from the `backend_implementations_03.md` document.

## Phase 1: Security Hardening

1.  **Separate JWT Secrets:**
    *   Create a new environment variable `PATIENT_JWT_SECRET` in `.env.example` and configure the application to use it for patient authentication.
    *   Update the `patientAuthService` to use the new secret.
2.  **Implement Rate Limiting:**
    *   Add rate limiting to sensitive patient authentication endpoints (`/login`, `/register`, `/reset-password`, `/resend-verification`) to prevent brute-force attacks.

## Phase 2: Refactor Patient Authentication

1.  **Improve `patientAuth` Middleware:**
    *   Implement the improved `authenticatePatient` middleware with proper type safety, JWT verification, and error handling as suggested in the document.
    *   Add the `requirePatientEmailVerification`, `ensurePatientClinicAccess`, and `optionalPatientAuth` middleware.
2.  **Enhance `patientAuthService`:**
    *   Refactor the `patientAuthService` to incorporate the suggested improvements, including:
        *   Using the separate `PATIENT_JWT_SECRET`.
        *   Implementing the `register` method with logic to link to an existing patient or create a new one.
        *   Improving the `login` method with better error handling and account lockout checks.
        *   Adding the `verifyToken` method.
3.  **Refactor `patientAuth` Routes:**
    *   Update the patient authentication routes to use the refactored `patientAuthService` and middleware.
    *   Standardize the response format for all patient authentication endpoints.
    *   Add the new endpoints suggested in the document (`/profile`, `/change-password`, `/resend-verification`, `/account`).

## Phase 3: Validation and Data Normalization

1.  **Enhance Patient Model Validation:**
    *   Update the `Patient` model with the enhanced validation rules for CPF, phone numbers, addresses, and medical history.
    *   Add the pre-save middleware for data normalization.
2.  **Enhance Clinic Model Validation:**
    *   Update the `Clinic` model with the enhanced validation rules for CNPJ, phone numbers, and working hours.
    *   Add the pre-save middleware for data normalization.
    *   Add the instance methods for clinic business logic.
3.  **Update Route Validation:**
    *   Update the validation rules in the `patients` and `patientAuth` routes to use the new validation functions.

## Phase 4: Final Touches

1.  **Update `app.ts`:**
    *   Ensure the `patientAuthRoutes` are correctly imported and used in `app.ts`.
2.  **Review and Test:**
    *   Thoroughly review all the changes and run the existing tests to ensure that nothing is broken.
    *   Write new tests for the new features and validation rules.

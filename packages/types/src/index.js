"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRole = exports.AppointmentStatus = exports.ContactStatus = void 0;
// ADDED: Status enums for better type safety
exports.ContactStatus = {
    NEW: 'new',
    CONTACTED: 'contacted',
    QUALIFIED: 'qualified',
    CONVERTED: 'converted',
    CLOSED: 'closed',
    DELETED: 'deleted',
    MERGED: 'merged'
};
exports.AppointmentStatus = {
    SCHEDULED: 'scheduled',
    CONFIRMED: 'confirmed',
    CHECKED_IN: 'checked_in',
    IN_PROGRESS: 'in_progress',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled',
    NO_SHOW: 'no_show'
};
exports.UserRole = {
    SUPER_ADMIN: 'super_admin',
    ADMIN: 'admin',
    MANAGER: 'manager',
    DENTIST: 'dentist',
    ASSISTANT: 'assistant'
};
//# sourceMappingURL=index.js.map
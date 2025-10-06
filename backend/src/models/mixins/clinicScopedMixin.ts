// backend/src/models/mixins/clinicScopedMixin.ts
import { Schema, SchemaDefinition } from 'mongoose';

export const clinicScopedFields: SchemaDefinition = {
    clinic: {
        type: Schema.Types.ObjectId,
        ref: 'Clinic',
        required: true,
        index: true
    }
};

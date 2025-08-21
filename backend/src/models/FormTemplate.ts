// backend/src/models/FormTemplate.ts
import { Schema, model } from 'mongoose';

const FormTemplateSchema = new Schema({
  title: String,
  questions: [{ id: String, label: String, type: String }],
  createdAt: { type: Date, default: Date.now }
});
export const FormTemplate = model('FormTemplate', FormTemplateSchema);

const FormResponseSchema = new Schema({
  templateId: { type: Schema.Types.ObjectId, ref: 'FormTemplate' },
  patientId: { type: Schema.Types.ObjectId, ref: 'Patient' },
  answers: Schema.Types.Mixed,
  submittedAt: { type: Date, default: Date.now }
});
export const FormResponse = model('FormResponse', FormResponseSchema);

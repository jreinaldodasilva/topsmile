// backend/src/services/patientService.ts
import { Patient as IPatient, CreatePatientDTO } from '@topsmile/types';
import { Patient as PatientModel } from '../models/Patient';
import mongoose from 'mongoose';
import { NotFoundError } from '../types/errors';

export interface UpdatePatientData extends Partial<CreatePatientDTO> {
    status?: 'active' | 'inactive';
}

export interface PatientSearchFilters {
    clinicId: string;
    search?: string;
    status?: 'active' | 'inactive';
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

export interface PatientSearchResult {
    patients: IPatient[];
    total: number;
    page: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
}

class PatientService {
    // Helper function to normalize phone number for comparison
    private normalizePhone(phone: string): string {
        const cleanPhone = phone.replace(/[^\d]/g, '');
        if (cleanPhone.length === 11) {
            return `(${cleanPhone.substring(0, 2)}) ${cleanPhone.substring(2, 7)}-${cleanPhone.substring(7)}`;
        } else if (cleanPhone.length === 10) {
            return `(${cleanPhone.substring(0, 2)}) ${cleanPhone.substring(2, 6)}-${cleanPhone.substring(6)}`;
        }
        return phone; // Return original if not valid format
    }

    // Create a new patient
    async createPatient(data: CreatePatientDTO & { clinic: string }): Promise<IPatient> {
        try {
            // Validate required fields
            if (!data.firstName || !data.lastName || !data.phone || !data.clinic) {
                throw new Error('Nome, sobrenome, telefone e clínica são obrigatórios');
            }

            // Validate clinic ID
            if (!mongoose.Types.ObjectId.isValid(data.clinic)) {
                throw new Error('ID da clínica inválido');
            }

            // Check if patient with same phone already exists in the clinic
            const normalizedPhone = this.normalizePhone(data.phone);
            const existingPatient = await PatientModel.findOne({
                phone: normalizedPhone,
                clinic: data.clinic,
                status: 'active'
            });

            if (existingPatient) {
                throw new Error('Já existe um paciente ativo com este telefone nesta clínica');
            }

            // Check if email is provided and already exists in the clinic
            if (data.email) {
                const existingEmailPatient = await PatientModel.findOne({
                    email: data.email.toLowerCase(),
                    clinic: data.clinic,
                    status: 'active'
                });

                if (existingEmailPatient) {
                    throw new Error('Já existe um paciente ativo com este e-mail nesta clínica');
                }
            }

            const patient = new PatientModel({
                ...data,
                email: data.email?.toLowerCase(),
                status: 'active'
            });

            return await patient.save();
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('Erro ao criar paciente');
        }
    }

    // Get patient by ID
    async getPatientById(patientId: string, clinicId: string): Promise<IPatient | null> {
        try {
            if (!mongoose.Types.ObjectId.isValid(patientId)) {
                throw new Error('ID do paciente inválido');
            }

            const patient = await PatientModel.findOne({
                _id: patientId,
                clinic: clinicId
            }).populate('clinic', 'name');

            return patient;
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('Erro ao buscar paciente');
        }
    }

    // Update patient
    async updatePatient(patientId: string, clinicId: string, data: UpdatePatientData): Promise<IPatient | null> {
        try {
            if (!mongoose.Types.ObjectId.isValid(patientId)) {
                throw new Error('ID do paciente inválido');
            }

            const patient = await PatientModel.findOne({
                _id: patientId,
                clinic: clinicId
            });

            if (!patient) {
                return null;
            }

            // Check for duplicate phone if phone is being updated
            if (data.phone && data.phone !== patient.phone) {
                const normalizedPhone = this.normalizePhone(data.phone);
                const existingPatient = await PatientModel.findOne({
                    phone: normalizedPhone,
                    clinic: clinicId,
                    status: 'active',
                    _id: { $ne: patientId }
                });

                if (existingPatient) {
                    throw new Error('Já existe um paciente ativo com este telefone nesta clínica');
                }
            }

            // Check for duplicate email if email is being updated
            if (data.email && data.email.toLowerCase() !== patient.email) {
                const existingEmailPatient = await PatientModel.findOne({
                    email: data.email.toLowerCase(),
                    clinic: clinicId,
                    status: 'active',
                    _id: { $ne: patientId }
                });

                if (existingEmailPatient) {
                    throw new Error('Já existe um paciente ativo com este e-mail nesta clínica');
                }
            }

            // Update patient data
            Object.keys(data).forEach(key => {
                if (key === 'email' && data.email) {
                    (patient as any)[key] = data.email.toLowerCase();
                } else if (data[key as keyof UpdatePatientData] !== undefined) {
                    (patient as any)[key] = data[key as keyof UpdatePatientData];
                }
            });

            return await patient.save();
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('Erro ao atualizar paciente');
        }
    }

    // Delete patient (soft delete by setting status to inactive)
    async deletePatient(patientId: string, clinicId: string): Promise<boolean> {
        try {
            if (!mongoose.Types.ObjectId.isValid(patientId)) {
                throw new Error('ID do paciente inválido');
            }

            const patient = await PatientModel.findOneAndUpdate(
                {
                    _id: patientId,
                    clinic: clinicId
                },
                {
                    status: 'inactive'
                },
                { new: true }
            );

            return !!patient;
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('Erro ao excluir paciente');
        }
    }

    // Search patients with filters and pagination
    async searchPatients(filters: PatientSearchFilters): Promise<PatientSearchResult> {
        try {
            const {
                clinicId,
                search,
                status = 'active',
                page = 1,
                limit = 20,
                sortBy = 'name',
                sortOrder = 'asc'
            } = filters;

            if (!mongoose.Types.ObjectId.isValid(clinicId)) {
                throw new Error('ID da clínica inválido');
            }

            // Build query
            const query: any = {
                clinic: clinicId,
                status
            };

            // Add search functionality
            if (search && search.trim()) {
                const searchRegex = new RegExp(search.trim(), 'i');
                query.$or = [
                    { name: searchRegex },
                    { email: searchRegex },
                    { phone: searchRegex },
                    { cpf: searchRegex },
                    { 'medicalHistory.conditions': searchRegex },
                    { 'medicalHistory.allergies': searchRegex }
                ];
            }

            // Calculate pagination
            const skip = (page - 1) * limit;
            const sortOptions: any = {};
            sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

            // Execute query with pagination
            const [patients, total] = await Promise.all([
                PatientModel.find(query)
                    .sort(sortOptions)
                    .skip(skip)
                    .limit(limit)
                    .populate('clinic', 'name'),
                PatientModel.countDocuments(query)
            ]);

            const totalPages = Math.ceil(total / limit);

            return {
                patients,
                total,
                page,
                totalPages,
                hasNext: page < totalPages,
                hasPrev: page > 1
            };
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('Erro ao buscar pacientes');
        }
    }

    // Get patients by clinic
    async getPatientsByClinic(clinicId: string, status: 'active' | 'inactive' | 'all' = 'active'): Promise<IPatient[]> {
        try {
            if (!mongoose.Types.ObjectId.isValid(clinicId)) {
                throw new Error('ID da clínica inválido');
            }

            const query: any = { clinic: clinicId };
            if (status !== 'all') {
                query.status = status;
            }

            return await PatientModel.find(query)
                .sort({ name: 1 })
                .populate('clinic', 'name');
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('Erro ao buscar pacientes da clínica');
        }
    }

    // Update medical history
    async updateMedicalHistory(
        patientId: string, 
        clinicId: string, 
        medicalHistory: {
            allergies?: string[];
            medications?: string[];
            conditions?: string[];
            notes?: string;
        }
    ): Promise<IPatient | null> {
        try {
            if (!mongoose.Types.ObjectId.isValid(patientId)) {
                throw new Error('ID do paciente inválido');
            }

            const patient = await PatientModel.findOneAndUpdate(
                {
                    _id: patientId,
                    clinic: clinicId
                },
                {
                    $set: {
                        'medicalHistory.allergies': medicalHistory.allergies || [],
                        'medicalHistory.medications': medicalHistory.medications || [],
                        'medicalHistory.conditions': medicalHistory.conditions || [],
                        'medicalHistory.notes': medicalHistory.notes || ''
                    }
                },
                { new: true, runValidators: true }
            ).populate('clinic', 'name');

            return patient;
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('Erro ao atualizar histórico médico');
        }
    }

    // Get patient statistics for a clinic
    async getPatientStats(clinicId: string): Promise<{
        total: number;
        active: number;
        inactive: number;
        recentlyAdded: number;
        withMedicalHistory: number;
    }> {
        try {
            if (!mongoose.Types.ObjectId.isValid(clinicId)) {
                throw new Error('ID da clínica inválido');
            }

            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

            const [
                total,
                active,
                inactive,
                recentlyAdded,
                withMedicalHistory
            ] = await Promise.all([
                PatientModel.countDocuments({ clinic: clinicId }),
                PatientModel.countDocuments({ clinic: clinicId, status: 'active' }),
                PatientModel.countDocuments({ clinic: clinicId, status: 'inactive' }),
                PatientModel.countDocuments({ 
                    clinic: clinicId, 
                    createdAt: { $gte: thirtyDaysAgo } 
                }),
                PatientModel.countDocuments({
                    clinic: clinicId,
                    $or: [
                        { 'medicalHistory.allergies.0': { $exists: true } },
                        { 'medicalHistory.medications.0': { $exists: true } },
                        { 'medicalHistory.conditions.0': { $exists: true } },
                        { 'medicalHistory.notes': { $ne: '', $exists: true } }
                    ]
                })
            ]);

            return {
                total,
                active,
                inactive,
                recentlyAdded,
                withMedicalHistory
            };
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('Erro ao buscar estatísticas de pacientes');
        }
    }

    // Reactivate patient
    async reactivatePatient(patientId: string, clinicId: string): Promise<IPatient | null> {
        try {
            if (!mongoose.Types.ObjectId.isValid(patientId)) {
                throw new Error('ID do paciente inválido');
            }

            const patient = await PatientModel.findOne({
                _id: patientId,
                clinic: clinicId,
                status: 'inactive'
            });

            if (!patient) {
                throw new NotFoundError('Paciente inativo');
            }

            // Check for duplicate phone with active patients
            const existingActivePatient = await PatientModel.findOne({
                phone: patient.phone,
                clinic: clinicId,
                status: 'active',
                _id: { $ne: patientId }
            });

            if (existingActivePatient) {
                throw new Error('Já existe um paciente ativo com este telefone nesta clínica');
            }

            // Check for duplicate email with active patients
            if (patient.email) {
                const existingActiveEmailPatient = await PatientModel.findOne({
                    email: patient.email,
                    clinic: clinicId,
                    status: 'active',
                    _id: { $ne: patientId }
                });

                if (existingActiveEmailPatient) {
                    throw new Error('Já existe um paciente ativo com este e-mail nesta clínica');
                }
            }

            patient.status = 'active';
            return await patient.save();
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('Erro ao reativar paciente');
        }
    }
}

export const patientService = new PatientService();
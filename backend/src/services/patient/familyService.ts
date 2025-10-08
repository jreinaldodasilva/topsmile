// backend/src/services/familyService.ts
import { NotFoundError } from '../../utils/errors/errors';
import mongoose from 'mongoose';
import type { Patient as IPatient } from '@topsmile/types';
import { Patient } from '../../models/Patient';

class FamilyService {
    async linkFamilyMembers(primaryPatientId: string, memberIds: string[]) {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const primary = await Patient.findById(primaryPatientId).session(session);
            if (!primary) throw new NotFoundError('Paciente principal');

            const members = await Patient.find({
                _id: { $in: memberIds },
                clinic: primary.clinic
            }).session(session);

            if (members.length !== memberIds.length) {
                throw new NotFoundError('Alguns membros da família');
            }

            primary.familyMembers = memberIds.map(id => new mongoose.Types.ObjectId(id)) as any;
            await primary.save({ session });

            for (const member of members) {
                if (!member.familyMembers) member.familyMembers = [] as any;
                if (member.familyMembers && !member.familyMembers.some((id: any) => id.toString() === primaryPatientId)) {
                    (member.familyMembers as any).push(new mongoose.Types.ObjectId(primaryPatientId));
                }
                await member.save({ session });
            }

            await session.commitTransaction();
            return primary;
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    }

    async unlinkFamilyMember(primaryPatientId: string, memberId: string) {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const primary = await Patient.findById(primaryPatientId).session(session);
            const member = await Patient.findById(memberId).session(session);

            if (!primary || !member) throw new NotFoundError('Paciente');

            primary.familyMembers = (primary.familyMembers?.filter(
                (id: any) => id.toString() !== memberId
            ) || []) as any;
            await primary.save({ session });

            member.familyMembers = (member.familyMembers?.filter(
                (id: any) => id.toString() !== primaryPatientId
            ) || []) as any;
            await member.save({ session });

            await session.commitTransaction();
            return primary;
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    }

    async getFamilyMembers(patientId: string) {
        const patient = await Patient.findById(patientId)
            .populate('familyMembers', 'firstName lastName email phone dateOfBirth')
            .lean();

        return patient?.familyMembers || [];
    }
}

export const familyService = new FamilyService();

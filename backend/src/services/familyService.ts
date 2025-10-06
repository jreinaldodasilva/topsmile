// backend/src/services/familyService.ts
import { Patient } from '../models/Patient';
import { NotFoundError } from '../utils/errors';
import mongoose from 'mongoose';

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

            primary.familyMembers = memberIds.map(id => new mongoose.Types.ObjectId(id));
            await primary.save({ session });

            for (const member of members) {
                if (!member.familyMembers) member.familyMembers = [];
                if (!member.familyMembers.some(id => id.toString() === primaryPatientId)) {
                    member.familyMembers.push(new mongoose.Types.ObjectId(primaryPatientId));
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

            primary.familyMembers = primary.familyMembers?.filter(
                id => id.toString() !== memberId
            ) || [];
            await primary.save({ session });

            member.familyMembers = member.familyMembers?.filter(
                id => id.toString() !== primaryPatientId
            ) || [];
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

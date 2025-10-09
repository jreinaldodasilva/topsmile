import { DentalChart } from '../../models/DentalChart';
import { ValidationError } from '../../utils/errors/errors';
import mongoose from 'mongoose';
import type { DentalChart as IDentalChart } from '@topsmile/types';

type DentalChart = IDentalChart & { _id?: string };

export interface CreateDentalChartData {
  patient: string;
  provider: string;
  clinic: string;
  numberingSystem: 'fdi' | 'universal';
  teeth?: any[];
  chartDate?: Date;
  notes?: string;
}

export interface UpdateDentalChartData {
  teeth?: any[];
  notes?: string;
  chartDate?: Date;
}

class DentalChartService {
  async createDentalChart(data: CreateDentalChartData): Promise<DentalChart> {
    if (!data.patient || !data.provider || !data.clinic) {
      throw new ValidationError('Paciente, profissional e clínica são obrigatórios');
    }

    if (!mongoose.Types.ObjectId.isValid(data.patient) || 
        !mongoose.Types.ObjectId.isValid(data.provider) || 
        !mongoose.Types.ObjectId.isValid(data.clinic)) {
      throw new ValidationError('IDs inválidos');
    }

    const chart = new DentalChart({
      ...data,
      chartDate: data.chartDate || new Date()
    });

    return await chart.save() as any;
  }

  async getDentalChartById(chartId: string, clinicId: string): Promise<IDentalChart | null> {
    if (!mongoose.Types.ObjectId.isValid(chartId)) {
      throw new ValidationError('ID do odontograma inválido');
    }

    return await DentalChart.findOne({
      _id: chartId,
      clinic: clinicId
    })
      .populate('patient', 'firstName lastName')
      .populate('provider', 'name') as any;
  }

  async getDentalChartsByPatient(patientId: string, clinicId: string): Promise<DentalChart[]> {
    if (!mongoose.Types.ObjectId.isValid(patientId)) {
      throw new ValidationError('ID do paciente inválido');
    }

    return await DentalChart.find({
      patient: patientId,
      clinic: clinicId
    })
      .populate('provider', 'name')
      .sort({ chartDate: -1 })
      .lean() as any;
  }

  async getLatestDentalChart(patientId: string, clinicId: string): Promise<IDentalChart | null> {
    if (!mongoose.Types.ObjectId.isValid(patientId)) {
      throw new ValidationError('ID do paciente inválido');
    }

    return await DentalChart.findOne({
      patient: patientId,
      clinic: clinicId
    })
      .populate('provider', 'name')
      .sort({ chartDate: -1 }) as any;
  }

  async updateDentalChart(
    chartId: string,
    clinicId: string,
    data: UpdateDentalChartData
  ): Promise<IDentalChart | null> {
    if (!mongoose.Types.ObjectId.isValid(chartId)) {
      throw new ValidationError('ID do odontograma inválido');
    }

    return await DentalChart.findOneAndUpdate(
      { _id: chartId, clinic: clinicId },
      data,
      { new: true, runValidators: true }
    );
  }

  async deleteDentalChart(chartId: string, clinicId: string): Promise<boolean> {
    if (!mongoose.Types.ObjectId.isValid(chartId)) {
      throw new ValidationError('ID do odontograma inválido');
    }

    const result = await DentalChart.findOneAndDelete({
      _id: chartId,
      clinic: clinicId
    });

    return !!result;
  }
}

export const dentalChartService = new DentalChartService();

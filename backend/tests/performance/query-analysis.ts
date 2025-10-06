import mongoose from 'mongoose';
import { Appointment } from '../../src/models/Appointment';
import { Patient } from '../../src/models/Patient';

interface QueryMetrics {
  query: string;
  executionTime: number;
  documentsExamined: number;
  documentsReturned: number;
  indexUsed: boolean;
}

export async function analyzeSlowQueries(): Promise<QueryMetrics[]> {
  const metrics: QueryMetrics[] = [];

  // Test 1: Appointments query
  const start1 = Date.now();
  const appointments = await Appointment.find({ status: 'scheduled' })
    .populate('patient')
    .populate('provider')
    .explain('executionStats');
  metrics.push({
    query: 'Appointment.find with populate',
    executionTime: Date.now() - start1,
    documentsExamined: (appointments as any).executionStats.totalDocsExamined,
    documentsReturned: (appointments as any).executionStats.nReturned,
    indexUsed: (appointments as any).executionStats.executionStages.inputStage?.indexName !== undefined,
  });

  // Test 2: Patient search
  const start2 = Date.now();
  const patients = await Patient.find({
    $or: [
      { name: /test/i },
      { email: /test/i }
    ]
  }).explain('executionStats');
  metrics.push({
    query: 'Patient.find with regex',
    executionTime: Date.now() - start2,
    documentsExamined: (patients as any).executionStats.totalDocsExamined,
    documentsReturned: (patients as any).executionStats.nReturned,
    indexUsed: (patients as any).executionStats.executionStages.inputStage?.indexName !== undefined,
  });

  // Test 3: Date range query
  const start3 = Date.now();
  const dateAppointments = await Appointment.find({
    scheduledStart: {
      $gte: new Date('2024-01-01'),
      $lte: new Date('2024-12-31')
    }
  }).explain('executionStats');
  metrics.push({
    query: 'Appointment date range',
    executionTime: Date.now() - start3,
    documentsExamined: (dateAppointments as any).executionStats.totalDocsExamined,
    documentsReturned: (dateAppointments as any).executionStats.nReturned,
    indexUsed: (dateAppointments as any).executionStats.executionStages.inputStage?.indexName !== undefined,
  });

  return metrics;
}

export function reportSlowQueries(metrics: QueryMetrics[]): void {
  console.log('\n=== Query Performance Analysis ===\n');
  
  metrics.forEach((metric, index) => {
    console.log(`Query ${index + 1}: ${metric.query}`);
    console.log(`  Execution Time: ${metric.executionTime}ms`);
    console.log(`  Documents Examined: ${metric.documentsExamined}`);
    console.log(`  Documents Returned: ${metric.documentsReturned}`);
    console.log(`  Index Used: ${metric.indexUsed ? 'Yes' : 'No'}`);
    console.log(`  Efficiency: ${((metric.documentsReturned / metric.documentsExamined) * 100).toFixed(2)}%`);
    
    if (metric.executionTime > 100) {
      console.log(`  ⚠️  SLOW QUERY (>100ms)`);
    }
    if (!metric.indexUsed) {
      console.log(`  ⚠️  NO INDEX USED`);
    }
    console.log('');
  });
}

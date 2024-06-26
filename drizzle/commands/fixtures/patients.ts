import { sql } from 'drizzle-orm';

import { db } from '../../../src/lib/server/db';
import { NewPatient, patients } from '../../../src/lib/server/db/schema/patients';

const newPatients: NewPatient[] = [
  {
    phone: '0608977564',
  },
  {
    phone: '0608977565',
  },
  {
    phone: '0608977566',
  },
  {
    phone: '0608977567',
  },
  {
    phone: '0608977568',
  },
  {
    phone: '0608977569',
  },
  {
    phone: '0608977570',
  },
  {
    phone: '0608977571',
  },
  {
    phone: '0608977572',
  },
  {
    phone: '0608977573',
  },
];

export const seedPatients = async () => {
  console.log('Seeding patients...');

  try {
    await db
      .insert(patients)
      .values(newPatients)
      .onDuplicateKeyUpdate({ set: { phone: sql`phone` } });

    console.log(`${newPatients.length} Patients created`);
  } catch (error) {
    console.log('Failed to create patients');
    console.error(error);
  }
};

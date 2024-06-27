import { sql } from 'drizzle-orm';
import { Argon2id } from 'oslo/password';

import { db } from '../../../src/lib/server/db';
import { NewUser, users } from '../../../src/lib/server/db/schema/users';

const password = await new Argon2id().hash('xxx');

const newUsers: NewUser[] = [
  {
    email: 'michaelscott@calmedica.com',
    firstName: 'Michael',
    lastName: 'Scott',
    password,
  },
  {
    email: 'johndoe@calmedica.com',
    firstName: 'John',
    lastName: 'Doe',
    password,
  },
  {
    email: 'janedoe@calmedica.com',
    firstName: 'Jane',
    lastName: 'Doe',
    password,
  },
  {
    email: 'bobrazowski@calmedica.com',
    firstName: 'Bob',
    lastName: 'Razowski',
    password,
  },
];

export const seedUsers = async () => {
  console.log('Seeding users...');

  try {
    await db
      .insert(users)
      .values(newUsers)
      .onDuplicateKeyUpdate({ set: { email: sql`email` } });

    console.log(`${newUsers.length} Users created`);
  } catch (error) {
    console.log('Failed to create users');
    console.error(error);
  }
};

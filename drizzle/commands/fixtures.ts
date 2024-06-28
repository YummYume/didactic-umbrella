import { seedMessages } from './fixtures/messages';
import { seedPatients } from './fixtures/patients';
import { seedUsers } from './fixtures/users';

async function loadFixtures() {
  console.log('Loading fixtures...');

  try {
    await seedUsers();
    await seedPatients();
    await seedMessages();

    console.log('Fixtures loaded successfully');
    process.exit(0);
  } catch (error) {
    console.log('Failed to load fixtures');
    console.error(error);
    process.exit(1);
  }
}

await loadFixtures();

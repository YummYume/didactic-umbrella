import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const loadDrizzleConfig = async () => {
  const configPath = path.resolve(__dirname, './drizzle.config.ts');
  const drizzleConfig = await import(configPath);
  return drizzleConfig.default;
};

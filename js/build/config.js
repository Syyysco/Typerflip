import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const config = JSON.parse(
  readFileSync(join(__dirname, '../../config/build.config.json'), 'utf8')
);
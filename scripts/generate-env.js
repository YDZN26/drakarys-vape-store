const fs = require('fs');
const path = require('path');
require('dotenv').config();

const supabaseUrl = process.env['SUPABASE_URL'] || '';
const supabaseAnonKey = process.env['SUPABASE_ANON_KEY'] || '';
const whatsappNumber = process.env['WHATSAPP_NUMBER'] || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '\n[generate-env] WARNING: missing SUPABASE_URL and/or SUPABASE_ANON_KEY in .env. ' +
    'Generated environment files will have empty Supabase credentials.\n'
  );
}

if (!whatsappNumber) {
  console.warn(
    '\n[generate-env] WARNING: missing WHATSAPP_NUMBER in .env. ' +
    'Generated environment files will have an empty WhatsApp number.\n'
  );
}

const buildFile = (production) => `export const environment = {
  production: ${production},
  supabaseUrl: '${supabaseUrl}',
  supabaseAnonKey: '${supabaseAnonKey}',
  whatsappNumber: '${whatsappNumber}'
};
`;

const targets = [
  { file: 'environment.ts', production: false },
  { file: 'environment.prod.ts', production: true },
];

const environmentsDir = path.join(__dirname, '..', 'src', 'environments');

for (const { file, production } of targets) {
  const filePath = path.join(environmentsDir, file);
  fs.writeFileSync(filePath, buildFile(production));
  console.log(`[generate-env] Wrote ${path.relative(process.cwd(), filePath)}`);
}

const fs = require('fs');
const path = require('path');
require('dotenv').config();

const supabaseUrl = process.env['SUPABASE_URL'] || '';
const supabaseAnonKey = process.env['SUPABASE_ANON_KEY'] || '';
const whatsappNumber = process.env['WHATSAPP_NUMBER'] || '';
const gaMeasurementId = process.env['GA_MEASUREMENT_ID'] || '';

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

if (!gaMeasurementId) {
  console.warn(
    '\n[generate-env] WARNING: missing GA_MEASUREMENT_ID in .env. ' +
    'Generated environment files will have an empty Google Analytics measurement ID.\n'
  );
}

const buildFile = (production) => `export const environment = {
  production: ${production},
  supabaseUrl: '${supabaseUrl}',
  supabaseAnonKey: '${supabaseAnonKey}',
  whatsappNumber: '${whatsappNumber}',
  gaMeasurementId: '${gaMeasurementId}'
};
`;

const targets = [
  { file: 'environment.ts', production: false },
  { file: 'environment.prod.ts', production: true },
];

const environmentsDir = path.join(__dirname, '..', 'src', 'environments');

fs.mkdirSync(environmentsDir, { recursive: true });

for (const { file, production } of targets) {
  const filePath = path.join(environmentsDir, file);
  fs.writeFileSync(filePath, buildFile(production));
  console.log(`[generate-env] Wrote ${path.relative(process.cwd(), filePath)}`);
}

// Generate src/index.generated.html from the versioned src/index.html template,
// injecting the Google Analytics (gtag.js) script in place of the
// GA_SCRIPT_PLACEHOLDER comment. This keeps the real measurement ID out of the
// git-tracked index.html, the same way real Supabase/WhatsApp values never
// touch the git-tracked environment.ts template above.
const indexTemplatePath = path.join(__dirname, '..', 'src', 'index.html');
const indexGeneratedPath = path.join(__dirname, '..', 'src', 'index.generated.html');

const gaScript = gaMeasurementId
  ? `<script async src="https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${gaMeasurementId}');
  </script>`
  : '<!-- GA_MEASUREMENT_ID not set: Google Analytics disabled -->';

const indexTemplate = fs.readFileSync(indexTemplatePath, 'utf8');
const indexOutput = indexTemplate.replace('<!-- GA_SCRIPT_PLACEHOLDER -->', gaScript);
fs.writeFileSync(indexGeneratedPath, indexOutput);
console.log(`[generate-env] Wrote ${path.relative(process.cwd(), indexGeneratedPath)}`);

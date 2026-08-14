import { createHash } from 'node:crypto';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const OUT_DIR = 'out';
const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;
const PROJECT = 'toutai';

function walk(dir) {
  const entries = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) {
      entries.push(...walk(full));
    } else {
      entries.push(full);
    }
  }
  return entries;
}

function hashFile(path) {
  const data = readFileSync(path);
  return createHash('sha256').update(data).digest('hex').slice(0, 32);
}

async function deploy() {
  if (!ACCOUNT_ID) {
    throw new Error(
      'Set CLOUDFLARE_ACCOUNT_ID before running deploy.'
    );
  }

  if (!API_TOKEN) {
    throw new Error(
      'Set CLOUDFLARE_API_TOKEN before running deploy. Create one at https://dash.cloudflare.com/profile/api-tokens'
    );
  }

  const files = walk(OUT_DIR);
  const manifest = {};
  for (const file of files) {
    const key = '/' + relative(OUT_DIR, file).replace(/\\/g, '/');
    manifest[key] = hashFile(file);
  }

  const form = new FormData();
  form.append('branch', 'main');
  form.append('manifest', JSON.stringify(manifest));

  for (const file of files) {
    const key = '/' + relative(OUT_DIR, file).replace(/\\/g, '/');
    const blob = new Blob([readFileSync(file)]);
    form.append(key, blob, key.split('/').pop());
  }

  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/pages/projects/${PROJECT}/deployments`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${API_TOKEN}`
      },
      body: form
    }
  );

  const result = await response.json();
  if (!response.ok || !result.success) {
    console.error(JSON.stringify(result, null, 2));
    process.exit(1);
  }

  console.log('Deployed:', result.result?.url ?? result.result?.id);
}

deploy().catch((error) => {
  console.error(error);
  process.exit(1);
});

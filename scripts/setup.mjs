#!/usr/bin/env node
/**
 * AEF one-click local setup — copies env template and optional app name.
 * Usage: npm run setup
 *        npm run setup -- --name "My Product Name"
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

function parseArgs(argv) {
  const nameIndex = argv.indexOf("--name");
  if (nameIndex !== -1 && argv[nameIndex + 1]) {
    return { appName: argv[nameIndex + 1] };
  }

  return { appName: null };
}

function upsertEnvValue(content, key, value) {
  const line = `${key}=${value}`;
  const pattern = new RegExp(`^${key}=.*$`, "m");

  if (pattern.test(content)) {
    return content.replace(pattern, line);
  }

  return `${content.trimEnd()}\n${line}\n`;
}

function main() {
  const { appName } = parseArgs(process.argv.slice(2));
  const envExample = path.join(root, ".env.example");
  const envLocal = path.join(root, ".env.local");

  if (!fs.existsSync(envExample)) {
    console.error("Missing .env.example");
    process.exit(1);
  }

  if (fs.existsSync(envLocal)) {
    console.log("✓ .env.local already exists (unchanged)");
  } else {
    fs.copyFileSync(envExample, envLocal);
    console.log("✓ Created .env.local from .env.example");
  }

  if (appName) {
    let content = fs.readFileSync(envLocal, "utf8");
    content = upsertEnvValue(content, "NEXT_PUBLIC_APP_NAME", appName);
    fs.writeFileSync(envLocal, content);
    console.log(`✓ Set NEXT_PUBLIC_APP_NAME="${appName}"`);
  }

  console.log(`
Next steps
----------
1. Fill in .env.local (Supabase, Gemini, Resend)
2. Run Supabase migrations:
   - supabase/migrations/00001_init.sql
   - supabase/migrations/00002_incidents.sql
   - supabase/migrations/00003_incident_attachments.sql
3. npm install   (if you have not already)
4. npm run dev   → http://localhost:3000
5. In Cursor: "Read PROJECT_CONSTITUTION.md and follow it."

New project from GitHub template
------------------------------
https://github.com/navee03090/ai-engineering-framework/generate

Full guide: docs/TEMPLATE-SETUP.md
v0 UI import: docs/V0-IMPORT-GUIDE.md
`);
}

main();

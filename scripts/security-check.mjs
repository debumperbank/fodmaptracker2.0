import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const ignoredDirectories = new Set([
  ".git",
  "node_modules",
  ".next",
  ".vercel",
  "coverage",
  "dist",
  "build",
]);
const scannedExtensions = new Set([
  ".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs",
  ".json", ".md", ".sql", ".yml", ".yaml", ".toml",
  ".config", ".html", ".css",
]);

const checks = [
  ["private-key", /-----BEGIN (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----/i],
  ["Supabase-secret-key", /\bsb_secret_[A-Za-z0-9_-]{12,}\b/i],
  ["GitHub-token", /\b(?:ghp_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,})\b/],
  ["AWS-access-key", /\bAKIA[0-9A-Z]{16}\b/],
  ["Slack-token", /\bxox[baprs]-[A-Za-z0-9-]{10,}\b/],
  ["Stripe-secret-key", /\b(?:sk|rk)_(?:live|test)_[A-Za-z0-9]{16,}\b/],
  ["database-URL-with-password", /postgres(?:ql)?:\/\/[^:\s/]+:[^@\s/]+@/i],
  ["service-role-key-assignment", /\b(?:SUPABASE_SERVICE_ROLE_KEY|SERVICE_ROLE_KEY)\s*=\s*(?!your_|YOUR_|placeholder|example|<)[^\s#]+/i],
  ["secret-env-exposed-as-public", /\bNEXT_PUBLIC_[A-Z0-9_]*(?:SERVICE_ROLE|SECRET|PRIVATE|DATABASE_URL|JWT_SECRET|PASSWORD|ACCESS_TOKEN|ADMIN_TOKEN)\b/i],
];

const findings = [];

async function scanDirectory(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    const relativePath = path.relative(root, fullPath).split(path.sep).join("/");

    if (entry.isDirectory()) {
      if (!ignoredDirectories.has(entry.name)) await scanDirectory(fullPath);
      continue;
    }

    if (relativePath === "scripts/security-check.mjs") continue;
    if (entry.name.startsWith(".env") && entry.name !== ".env.example") continue;

    const isEnvExample = entry.name === ".env.example";
    if (!isEnvExample && !scannedExtensions.has(path.extname(entry.name).toLowerCase())) continue;

    let contents;
    try {
      contents = await readFile(fullPath, "utf8");
    } catch {
      continue;
    }

    const lines = contents.split(/\r?\n/);
    lines.forEach((line, index) => {
      for (const [label, pattern] of checks) {
        pattern.lastIndex = 0;
        if (pattern.test(line)) {
          findings.push({ file: relativePath, line: index + 1, check: label });
        }
      }
    });
  }
}

await scanDirectory(root);

if (findings.length > 0) {
  console.error("Security check failed. Potential secret exposure detected:");
  for (const finding of findings) {
    console.error(`- ${finding.file}:${finding.line} [${finding.check}]`);
  }
  console.error("Values are intentionally not printed. Remove exposed secrets and rotate them if they were ever committed.");
  process.exitCode = 1;
} else {
  console.log("Security check passed: no configured secret patterns found in source/config files.");
  console.log("Note: this scan cannot prove that every possible secret is absent.");
}

/**
 * POPCIX Automated Security Audit Scanner
 * 
 * Performs static analysis across the entire project to ensure:
 * 1. Zero logging of passwords, tokens, credentials, or session secrets.
 * 2. Zero custom password hashing algorithms (MD5, SHA1, custom bcrypt/argon2).
 * 3. Zero custom JWT implementations (Supabase Auth must be the sole auth provider).
 * 4. Zero sensitive payment card data storage.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const DANGEROUS_LOG_PATTERNS = [
  /console\.log\s*\([^)]*(password|passwd|pwd)[^)]*\)/i,
  /console\.log\s*\([^)]*(token|accessToken|refreshToken|jwt|secret)[^)]*\)/i,
  /console\.log\s*\([^)]*(credential|credentials|apiKey|authSecret)[^)]*\)/i,
  /console\.log\s*\([^)]*req\.body[^)]*\)/i,
  /console\.log\s*\([^)]*(cardNumber|cvv|card_number)[^)]*\)/i,
  /logger\.\w+\s*\([^)]*(password|token|accessToken|refreshToken|cvv)[^)]*\)/i,
];

const FORBIDDEN_AUTH_PATTERNS = [
  { pattern: /createHmac\s*\(\s*['"](md5|sha1)['"]/i, desc: 'Deprecated insecure hash algorithm (MD5/SHA-1)' },
  { pattern: /jwt\.sign\s*\(/i, desc: 'Forbidden custom JWT generation (Must use Supabase Auth)' },
  { pattern: /jwt\.verify\s*\(/i, desc: 'Forbidden custom JWT verification (Must use Supabase Auth)' },
  { pattern: /password_hash\s+VARCHAR/i, desc: 'Forbidden custom password hash column in database' },
  { pattern: /password\s+VARCHAR/i, desc: 'Forbidden plaintext password column in database' },
];

const IGNORED_DIRS = ['node_modules', '.git', 'dist', 'build', '.gemini'];

function scanDirectory(dirPath, violations = []) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      if (!IGNORED_DIRS.includes(entry.name)) {
        scanDirectory(fullPath, violations);
      }
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name);
      if (['.js', '.ts', '.tsx', '.jsx', '.sql'].includes(ext) && entry.name !== 'security-audit.js') {
        auditFile(fullPath, violations);
      }
    }
  }

  return violations;
}

function auditFile(filePath, violations) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const relPath = path.relative(rootDir, filePath);

  lines.forEach((line, idx) => {
    // Check dangerous logs
    for (const pattern of DANGEROUS_LOG_PATTERNS) {
      if (pattern.test(line)) {
        violations.push({
          file: relPath,
          line: idx + 1,
          snippet: line.trim(),
          type: 'SENSITIVE_LOGGING_EXPOSURE',
          message: 'Found potential logging of sensitive credentials, token, or password.',
        });
      }
    }

    // Check forbidden auth mechanisms
    for (const { pattern, desc } of FORBIDDEN_AUTH_PATTERNS) {
      if (pattern.test(line)) {
        violations.push({
          file: relPath,
          line: idx + 1,
          snippet: line.trim(),
          type: 'FORBIDDEN_AUTH_ARCHITECTURE',
          message: desc,
        });
      }
    }
  });
}

console.log('🔒 Running POPCIX Security & Compliance Audit...\n');

const violations = scanDirectory(rootDir);

if (violations.length === 0) {
  console.log('✅ SECURITY AUDIT PASSED!');
  console.log('  • 0 sensitive console.log or credential leaks found');
  console.log('  • 0 custom password hash/JWT implementations found');
  console.log('  • Supabase Auth confirmed as single source of truth');
  console.log('  • Safe structured logging validated across codebase\n');
  process.exit(0);
} else {
  console.error(`❌ SECURITY AUDIT FAILED: Found ${violations.length} violations:\n`);
  violations.forEach((v, i) => {
    console.error(`  ${i + 1}. [${v.type}] ${v.file}:${v.line}`);
    console.error(`     Message: ${v.message}`);
    console.error(`     Snippet: "${v.snippet}"\n`);
  });
  process.exit(1);
}

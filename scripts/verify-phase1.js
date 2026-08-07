#!/usr/bin/env node
/**
 * RC-5 Phase 1: Single-Command Verification
 * 
 * Runs the complete Phase 1 verification pipeline:
 * 1. prisma validate
 * 2. prisma migrate deploy
 * 3. Phase 1 validation (schema, constraints, Better Auth, data)
 * 4. RC-4 smoke test (regression)
 * 
 * Exits with non-zero code if ANY step fails.
 * 
 * Usage:
 *   node scripts/verify-phase1.js
 *   npm run rc5:phase1:verify
 */

const { execSync } = require('child_process');

const PHASE = 'RC5-Phase1';
const MIGRATION = '20260807000000_better_auth_schema_alignment';
const steps = [];
let totalPassed = 0;
let totalFailed = 0;

function runStep(name, command, options = {}) {
  const startTime = Date.now();
  console.log(`\n${'═'.repeat(60)}`);
  console.log(`  STEP: ${name}`);
  console.log(`${'═'.repeat(60)}\n`);
  
  try {
    const output = execSync(command, {
      cwd: options.cwd || '/app',
      encoding: 'utf-8',
      stdio: 'pipe',
      timeout: options.timeout || 120000,
      env: { ...process.env, ...options.env },
    });
    
    const duration = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(output);
    console.log(`  ✅ ${name} PASSED (${duration}s)`);
    
    steps.push({ name, status: 'PASS', duration: `${duration}s` });
    totalPassed++;
    return { success: true, output };
  } catch (err) {
    const duration = ((Date.now() - startTime) / 1000).toFixed(1);
    
    if (err.stdout) console.log(err.stdout);
    if (err.stderr) console.error(err.stderr);
    
    console.log(`  ❌ ${name} FAILED (${duration}s)`);
    
    steps.push({ name, status: 'FAIL', duration: `${duration}s`, error: err.message?.substring(0, 200) });
    totalFailed++;
    
    if (options.fatal !== false) {
      throw err; // Stop execution on fatal steps
    }
    
    return { success: false, error: err.message };
  }
}

async function main() {
  console.log('╔══════════════════════════════════════════════════════════╗');
  console.log('║  RC-5 PHASE 1: SINGLE-COMMAND VERIFICATION              ║');
  console.log(`║  Migration: ${MIGRATION}        ║`);
  console.log('╚══════════════════════════════════════════════════════════╝');
  
  const overallStart = Date.now();
  
  // Step 1: Prisma Validate
  runStep('Prisma Validate', 'npx prisma validate');
  
  // Step 2: Prisma Migrate Deploy
  runStep('Prisma Migrate Deploy', 'npx prisma migrate deploy', { fatal: false });
  
  // Step 3: Phase 1 Validation
  runStep('Phase 1 Validation', 'node /app/rc5-phase1-validate.js');
  
  // Step 4: RC-4 Smoke Test (regression)
  runStep('RC-4 Smoke Test', 'node /app/rc4-smoke-test.js');
  
  // Final Summary
  const overallDuration = ((Date.now() - overallStart) / 1000).toFixed(1);
  const overall = totalFailed === 0 ? 'PASS' : 'FAIL';
  
  console.log(`\n${'═'.repeat(60)}`);
  console.log('  VERIFICATION COMPLETE');
  console.log(`${'═'.repeat(60)}`);
  console.log('');
  console.log(`  Steps: ${steps.length} total, ${totalPassed} passed, ${totalFailed} failed`);
  console.log(`  Duration: ${overallDuration}s`);
  console.log('');
  
  for (const step of steps) {
    const icon = step.status === 'PASS' ? '✅' : '❌';
    console.log(`  ${icon} ${step.name} — ${step.status} (${step.duration})`);
  }
  
  console.log('');
  console.log(`  OVERALL: ${overall}`);
  console.log(`${'═'.repeat(60)}`);
  
  // Machine-readable JSON summary
  const jsonSummary = {
    phase: PHASE,
    migration: MIGRATION,
    overall,
    totalPassed,
    totalFailed,
    duration: `${overallDuration}s`,
    steps: steps.map(s => ({ name: s.name, status: s.status, duration: s.duration })),
    timestamp: new Date().toISOString(),
  };
  
  console.log('\n--- JSON_SUMMARY_START ---');
  console.log(JSON.stringify(jsonSummary, null, 2));
  console.log('--- JSON_SUMMARY_END ---\n');
  
  process.exit(totalFailed > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error('\nFATAL:', err.message);
  
  // Still output JSON summary on fatal error
  const jsonSummary = {
    phase: PHASE,
    migration: MIGRATION,
    overall: 'FAIL',
    totalPassed,
    totalFailed: totalFailed + 1,
    steps: steps.map(s => ({ name: s.name, status: s.status, duration: s.duration })),
    error: err.message,
    timestamp: new Date().toISOString(),
  };
  
  console.log('\n--- JSON_SUMMARY_START ---');
  console.log(JSON.stringify(jsonSummary, null, 2));
  console.log('--- JSON_SUMMARY_END ---\n');
  
  process.exit(1);
});

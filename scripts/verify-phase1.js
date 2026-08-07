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
  try {
    runStep('Prisma Migrate Deploy', 'npx prisma migrate deploy');
  } catch (err) {
    const errorOutput = err.stdout || err.stderr || '';
    
    // Check if it's P3009 error (failed migrations in history)
    if (errorOutput.includes('P3009') || errorOutput.includes('failed migration')) {
      console.log('\n⚠️  P3009 Error: Failed migration found');
      console.log('   Migration was marked as failed but SQL may have succeeded.');
      console.log('   Attempting to reset migration state...\n');
      
      try {
        // Step 1: Mark failed migration as rolled back
        console.log('   Step 1: Resetting failed migration state...');
        runStep('Reset Failed Migration', 
          'npx prisma migrate resolve --rolled-back 20260807000000_better_auth_schema_alignment');
        
        // Step 2: Try deploy again
        console.log('\n   Step 2: Retrying migration deploy...');
        runStep('Retry Migrate Deploy', 'npx prisma migrate deploy');
        
      } catch (recoveryErr) {
        // If still failing, check if schema is up to date
        console.log('\n   Step 3: Deploy still failed, checking schema state...');
        
        try {
          const { Client } = require('pg');
          const client = new Client({
            connectionString: process.env.DATABASE_URL || 'postgresql://destiny_user:destiny_password@postgres:5432/destiny_rising_hub'
          });
          
          await client.connect();
          
          // Check if Account table has new columns (schema is up to date)
          const accountCheck = await client.query(`
            SELECT column_name FROM information_schema.columns 
            WHERE table_name = 'Account' AND column_name IN ('providerId', 'accountId', 'accessToken', 'refreshToken')
          `);
          
          await client.end();
          
          if (accountCheck.rows.length >= 4) {
            console.log('   Schema appears up to date, marking migration as applied...');
            runStep('Mark Migration Applied', 
              'npx prisma migrate resolve --applied 20260807000000_better_auth_schema_alignment');
          } else {
            throw new Error('Schema not up to date and migration failed');
          }
          
        } catch (schemaErr) {
          console.log('\n❌ P3009 recovery failed.');
          console.log('   Manual intervention required:');
          console.log('   1. Check _prisma_migrations table');
          console.log('   2. Reset failed migration: npx prisma migrate resolve --rolled-back 20260807000000_better_auth_schema_alignment');
          console.log('   3. Run migration again: npx prisma migrate deploy');
          console.log('\n   Error:', recoveryErr.message);
          throw recoveryErr;
        }
      }
      
    // Check if it's P3005 error (database schema not empty)
    } else if (errorOutput.includes('P3005')) {
      console.log('\n⚠️  P3005 Error: Database schema is not empty');
      console.log('   This means tables exist but migration history is missing.');
      console.log('   Attempting to apply migration manually and baseline...\n');
      
      try {
        // Step 1: Apply migration SQL manually to ensure schema is correct
        console.log('   Step 1: Applying migration SQL manually...');
        const fs = require('fs');
        const migrationPath = '/app/prisma/migrations/20260807000000_better_auth_schema_alignment/migration.sql';
        
        if (!fs.existsSync(migrationPath)) {
          throw new Error(`Migration file not found: ${migrationPath}`);
        }
        
        runStep('Apply Migration SQL', 
          `sh -c "PGPASSWORD=destiny_password psql -h postgres -U destiny_user -d destiny_rising_hub -f ${migrationPath}"`);
        
        // Step 2: Verify schema has expected tables/columns
        console.log('\n   Step 2: Verifying schema...');
        const { Client } = require('pg');
        const client = new Client({
          connectionString: process.env.DATABASE_URL || 'postgresql://destiny_user:destiny_password@postgres:5432/destiny_rising_hub'
        });
        
        await client.connect();
        
        // Check Account table has new columns
        const accountCheck = await client.query(`
          SELECT column_name FROM information_schema.columns 
          WHERE table_name = 'Account' AND column_name IN ('providerId', 'accountId', 'accessToken', 'refreshToken')
        `);
        
        if (accountCheck.rows.length < 4) {
          throw new Error('Schema verification failed: Account table missing expected columns');
        }
        
        // Check Verification table exists
        const verificationCheck = await client.query(`
          SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'Verification')
        `);
        
        if (!verificationCheck.rows[0].exists) {
          throw new Error('Schema verification failed: Verification table not found');
        }
        
        await client.end();
        console.log('   ✅ Schema verification passed');
        
        // Step 3: Baseline the migration
        console.log('\n   Step 3: Baseline migration...');
        runStep('Baseline Migration', 
          'npx prisma migrate resolve --applied 20260807000000_better_auth_schema_alignment');
        
        // Step 4: Verify with migrate status
        console.log('\n   Step 4: Verify migration status...');
        runStep('Prisma Migrate Status', 'npx prisma migrate status');
        
      } catch (recoveryErr) {
        console.log('\n❌ P3005 recovery failed.');
        console.log('   Manual intervention required:');
        console.log('   1. Check database state');
        console.log('   2. Apply migration manually if needed');
        console.log('   3. Run: docker compose exec app sh scripts/baseline-migration.sh');
        console.log('\n   Error:', recoveryErr.message);
        throw recoveryErr;
      }
    } else {
      throw err;
    }
  }
  
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

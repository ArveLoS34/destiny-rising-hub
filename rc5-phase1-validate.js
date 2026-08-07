/**
 * RC-5 Phase 1: Schema & Constraint Validation Script
 * 
 * Run after migration to verify:
 * - Primary Keys
 * - Foreign Keys
 * - Unique Constraints
 * - Indexes
 * - Cascade behavior
 * - Column types
 * - Data preservation
 * 
 * Usage: docker compose exec app node /app/rc5-phase1-validate.js
 */

const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL || 
    'postgresql://destiny_user:destiny_password@postgres:5432/destiny_rising_hub'
});

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ ${message}`);
    passed++;
  } else {
    console.log(`  ❌ ${message}`);
    failed++;
  }
}

async function query(sql) {
  const res = await client.query(sql);
  return res.rows;
}

async function validateAccountTable() {
  console.log('\n═══ ACCOUNT TABLE VALIDATION ═══\n');
  
  // 1. Column existence and types
  console.log('1. Column structure:');
  const columns = await query(`
    SELECT column_name, data_type, is_nullable, column_default
    FROM information_schema.columns
    WHERE table_name = 'Account'
    ORDER BY ordinal_position
  `);
  
  const colMap = {};
  columns.forEach(c => colMap[c.column_name] = c);
  
  assert(colMap['id'], 'id column exists');
  assert(colMap['providerId'], 'providerId column exists (renamed from provider)');
  assert(colMap['accountId'], 'accountId column exists (renamed from providerAccountId)');
  assert(colMap['userId'], 'userId column exists');
  assert(colMap['accessToken'], 'accessToken column exists (renamed from access_token)');
  assert(colMap['refreshToken'], 'refreshToken column exists (renamed from refresh_token)');
  assert(colMap['idToken'], 'idToken column exists (renamed from id_token)');
  assert(colMap['accessTokenExpiresAt'], 'accessTokenExpiresAt column exists (NEW)');
  assert(colMap['refreshTokenExpiresAt'], 'refreshTokenExpiresAt column exists (NEW)');
  assert(colMap['scope'], 'scope column exists');
  assert(colMap['password'], 'password column exists (NEW)');
  assert(colMap['createdAt'], 'createdAt column exists');
  assert(colMap['updatedAt'], 'updatedAt column exists');
  
  // 2. Old columns should NOT exist
  console.log('\n2. Old columns removed:');
  assert(!colMap['provider'], 'provider column removed (renamed to providerId)');
  assert(!colMap['providerAccountId'], 'providerAccountId column removed (renamed to accountId)');
  assert(!colMap['access_token'], 'access_token column removed (renamed to accessToken)');
  assert(!colMap['refresh_token'], 'refresh_token column removed (renamed to refreshToken)');
  assert(!colMap['id_token'], 'id_token column removed (renamed to idToken)');
  assert(!colMap['type'], 'type column removed');
  assert(!colMap['token_type'], 'token_type column removed');
  assert(!colMap['session_state'], 'session_state column removed');
  assert(!colMap['expires_at'], 'expires_at column removed');
  
  // 3. Primary Key
  console.log('\n3. Primary Key:');
  const pk = await query(`
    SELECT kcu.column_name
    FROM information_schema.table_constraints tc
    JOIN information_schema.key_column_usage kcu
      ON tc.constraint_name = kcu.constraint_name
    WHERE tc.table_name = 'Account' AND tc.constraint_type = 'PRIMARY KEY'
  `);
  assert(pk.length === 1 && pk[0].column_name === 'id', 'Primary Key on id');
  
  // 4. Foreign Key (userId → User.id with CASCADE)
  console.log('\n4. Foreign Key:');
  const fk = await query(`
    SELECT
      kcu.column_name,
      ccu.table_name AS foreign_table,
      ccu.column_name AS foreign_column,
      rc.delete_rule
    FROM information_schema.table_constraints tc
    JOIN information_schema.key_column_usage kcu
      ON tc.constraint_name = kcu.constraint_name
    JOIN information_schema.constraint_column_usage ccu
      ON tc.constraint_name = ccu.constraint_name
    JOIN information_schema.referential_constraints rc
      ON tc.constraint_name = rc.constraint_name
    WHERE tc.table_name = 'Account' AND tc.constraint_type = 'FOREIGN KEY'
  `);
  const userIdFk = fk.find(f => f.column_name === 'userId');
  assert(userIdFk, 'Foreign Key on userId exists');
  assert(userIdFk && userIdFk.foreign_table === 'User', 'FK references User table');
  assert(userIdFk && userIdFk.foreign_column === 'id', 'FK references User.id');
  assert(userIdFk && userIdFk.delete_rule === 'CASCADE', 'FK has ON DELETE CASCADE');
  
  // 5. Unique Constraint
  console.log('\n5. Unique Constraint:');
  const unique = await query(`
    SELECT kcu.column_name, tc.constraint_name
    FROM information_schema.table_constraints tc
    JOIN information_schema.key_column_usage kcu
      ON tc.constraint_name = kcu.constraint_name
    WHERE tc.table_name = 'Account' AND tc.constraint_type = 'UNIQUE'
    ORDER BY tc.constraint_name, kcu.ordinal_position
  `);
  const uniqueCols = unique.map(u => u.column_name).sort();
  assert(uniqueCols.includes('accountId') && uniqueCols.includes('providerId'),
    'Composite unique on (providerId, accountId)');
  
  // 6. Indexes
  console.log('\n6. Indexes:');
  const indexes = await query(`
    SELECT indexname, indexdef
    FROM pg_indexes
    WHERE tablename = 'Account'
  `);
  const indexNames = indexes.map(i => i.indexname);
  assert(indexNames.some(n => n.includes('userId')), 'Index on userId exists');
}

async function validateVerificationTable() {
  console.log('\n═══ VERIFICATION TABLE VALIDATION ═══\n');
  
  // 1. Table exists
  console.log('1. Table existence:');
  const exists = await query(`
    SELECT EXISTS (
      SELECT FROM information_schema.tables WHERE table_name = 'Verification'
    )
  `);
  assert(exists[0].exists, 'Verification table exists');
  
  // 2. Column structure
  console.log('\n2. Column structure:');
  const columns = await query(`
    SELECT column_name, data_type, is_nullable, column_default
    FROM information_schema.columns
    WHERE table_name = 'Verification'
    ORDER BY ordinal_position
  `);
  
  const colMap = {};
  columns.forEach(c => colMap[c.column_name] = c);
  
  assert(colMap['id'], 'id column exists');
  assert(colMap['identifier'], 'identifier column exists');
  assert(colMap['value'], 'value column exists');
  assert(colMap['expiresAt'], 'expiresAt column exists');
  assert(colMap['createdAt'], 'createdAt column exists');
  assert(colMap['createdAt'] && colMap['createdAt'].is_nullable === 'YES', 'createdAt is nullable');
  assert(colMap['updatedAt'], 'updatedAt column exists');
  assert(colMap['updatedAt'] && colMap['updatedAt'].is_nullable === 'YES', 'updatedAt is nullable');
  
  // 3. Primary Key
  console.log('\n3. Primary Key:');
  const pk = await query(`
    SELECT kcu.column_name
    FROM information_schema.table_constraints tc
    JOIN information_schema.key_column_usage kcu
      ON tc.constraint_name = kcu.constraint_name
    WHERE tc.table_name = 'Verification' AND tc.constraint_type = 'PRIMARY KEY'
  `);
  assert(pk.length === 1 && pk[0].column_name === 'id', 'Primary Key on id');
  
  // 4. Indexes
  console.log('\n4. Indexes:');
  const indexes = await query(`
    SELECT indexname FROM pg_indexes WHERE tablename = 'Verification'
  `);
  const indexNames = indexes.map(i => i.indexname);
  assert(indexNames.some(n => n.includes('identifier')), 'Index on identifier exists');
  assert(indexNames.some(n => n.includes('expiresAt')), 'Index on expiresAt exists');
}

async function validateDataPreservation() {
  console.log('\n═══ DATA PRESERVATION VALIDATION ═══\n');
  
  // Check test accounts
  const accounts = await query(`
    SELECT id, "providerId", "accountId", "accessToken", "refreshToken", "idToken"
    FROM "Account"
    WHERE id LIKE 'test-%'
    ORDER BY id
  `);
  
  assert(accounts.length >= 3, `Test accounts exist (${accounts.length} found, expected 3)`);
  
  const google = accounts.find(a => a.providerId === 'google');
  const github = accounts.find(a => a.providerId === 'github');
  const discord = accounts.find(a => a.providerId === 'discord');
  
  // Google account
  console.log('1. Google Account:');
  assert(google, 'Google account exists');
  assert(google && google.accountId === 'google-12345', 'Google accountId preserved');
  assert(google && google.accessToken === 'google-access-token-abc', 'Google accessToken preserved');
  assert(google && google.refreshToken === 'google-refresh-token-xyz', 'Google refreshToken preserved');
  assert(google && google.idToken === 'google-id-token-123', 'Google idToken preserved');
  
  // GitHub account
  console.log('\n2. GitHub Account:');
  assert(github, 'GitHub account exists');
  assert(github && github.accountId === 'github-67890', 'GitHub accountId preserved');
  assert(github && github.accessToken === 'github-access-token-def', 'GitHub accessToken preserved');
  
  // Discord account
  console.log('\n3. Discord Account:');
  assert(discord, 'Discord account exists');
  assert(discord && discord.accountId === 'discord-11111', 'Discord accountId preserved');
  assert(discord && discord.accessToken === 'discord-access-token-ghi', 'Discord accessToken preserved');
}

async function main() {
  console.log('╔═══════════════════════════════════════════════╗');
  console.log('║   RC-5 PHASE 1: SCHEMA & CONSTRAINT CHECK    ║');
  console.log('╚═══════════════════════════════════════════════╝');
  
  try {
    await client.connect();
    console.log('  ✅ Database connected');
  } catch (err) {
    console.error('  ❌ Database connection failed:', err.message);
    process.exit(1);
  }
  
  await validateAccountTable();
  await validateVerificationTable();
  await validateDataPreservation();
  
  await client.end();
  
  console.log('\n═══════════════════════════════════════════════');
  console.log(`  Results: ${passed} passed, ${failed} failed`);
  console.log('═══════════════════════════════════════════════\n');
  
  process.exit(failed > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error('Fatal error:', err.message);
  process.exit(1);
});

#!/usr/bin/env node

/**
 * Release Manifest Generator
 * 
 * Generates release-manifest.json before RC-6 (Launch Approval).
 * This file captures the exact state of the release for future reference.
 * 
 * Usage: npx tsx scripts/generate-release-manifest.ts
 */

import { execSync } from 'child_process';
import { writeFileSync } from 'fs';
import { join } from 'path';

interface ReleaseManifest {
  version: string;
  commit: string;
  branch: string;
  build: {
    nodeVersion: string;
    nextVersion: string;
    reactVersion: string;
    typescriptVersion: string;
  };
  database: {
    prismaVersion: string;
    postgresVersion: string;
    migrationVersion: string;
    schemaHash: string;
  };
  infrastructure: {
    redisVersion: string;
    minioVersion: string;
    dockerComposeVersion: string;
  };
  features: {
    characterCount: number;
    aiModel: string;
    searchIndex: string;
    contentVersion: string;
  };
  validation: {
    rc1: string;
    rc2: string;
    rc3: string;
    rc4: string;
    rc5: string;
    rc6: string;
  };
  releaseCandidate: string;
  generatedAt: string;
  generatedBy: string;
}

function getGitCommit(): string {
  try {
    return execSync('git rev-parse HEAD').toString().trim();
  } catch {
    return 'unknown';
  }
}

function getGitBranch(): string {
  try {
    return execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
  } catch {
    return 'unknown';
  }
}

function getNodeVersion(): string {
  return process.version;
}

function getPackageVersion(packageName: string): string {
  try {
    const pkg = require(join(process.cwd(), 'package.json'));
    return pkg.dependencies?.[packageName] || pkg.devDependencies?.[packageName] || 'unknown';
  } catch {
    return 'unknown';
  }
}

function getSchemaHash(): string {
  try {
    const { createHash } = require('crypto');
    const { readFileSync } = require('fs');
    const schema = readFileSync(join(process.cwd(), 'prisma/schema.prisma'), 'utf-8');
    return createHash('sha256').update(schema).digest('hex').substring(0, 16);
  } catch {
    return 'unknown';
  }
}

function generateManifest(): ReleaseManifest {
  const now = new Date().toISOString();

  return {
    version: '1.0.0',
    commit: getGitCommit(),
    branch: getGitBranch(),
    build: {
      nodeVersion: getNodeVersion(),
      nextVersion: getPackageVersion('next'),
      reactVersion: getPackageVersion('react'),
      typescriptVersion: getPackageVersion('typescript'),
    },
    database: {
      prismaVersion: getPackageVersion('@prisma/client'),
      postgresVersion: '16-alpine',
      migrationVersion: 'pending',
      schemaHash: getSchemaHash(),
    },
    infrastructure: {
      redisVersion: '7-alpine',
      minioVersion: 'latest',
      dockerComposeVersion: '3.8',
    },
    features: {
      characterCount: 20,
      aiModel: 'pending',
      searchIndex: 'pending',
      contentVersion: '1.4.0',
    },
    validation: {
      rc1: 'PENDING',
      rc2: 'PENDING',
      rc3: 'PENDING',
      rc4: 'PENDING',
      rc5: 'PENDING',
      rc6: 'PENDING',
    },
    releaseCandidate: 'RC-6',
    generatedAt: now,
    generatedBy: 'generate-release-manifest.ts',
  };
}

// Main
const manifest = generateManifest();
const outputPath = join(process.cwd(), 'release-manifest.json');
writeFileSync(outputPath, JSON.stringify(manifest, null, 2));

console.log('✅ Release manifest generated:');
console.log(`   Version: ${manifest.version}`);
console.log(`   Commit: ${manifest.commit}`);
console.log(`   Generated at: ${manifest.generatedAt}`);
console.log(`   Output: ${outputPath}`);

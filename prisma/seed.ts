import { PrismaClient } from '@prisma/client';
import { characters } from '@/data/games/destiny-rising/characters';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing data
  console.log('🗑️  Clearing existing characters...');
  await prisma.character.deleteMany();

  // Insert characters
  console.log('📝 Inserting characters...');
  for (const character of characters) {
    await prisma.character.create({
      data: {
        slug: character.slug,
        name: character.name,
        title: character.title,
        description: character.description || '',
        element: character.element,
        role: character.role,
        rarity: character.rarity,
        weaponType: character.weaponType,
        faction: character.faction,
        icon: character.icon,
        portrait: character.portrait,
        colorTheme: character.colorTheme,
        stats: character.stats as any,
        skills: character.skills as any,
        talents: character.talents as any,
        ascensionMaterials: character.ascensionMaterials as any,
        skillMaterials: character.skillMaterials as any,
        recommendedWeapons: character.recommendedWeapons,
        recommendedArtifacts: character.recommendedArtifacts,
        synergies: character.synergies,
        counters: character.counters,
        popularBuilds: character.popularBuilds as any,
        strengths: character.strengths as any,
        weaknesses: character.weaknesses as any,
        lore: character.lore,
        voiceActors: character.voiceActors as any,
        factionRelation: character.factionRelation as any,
        releaseVersion: character.releaseVersion,
        tierListPlacement: character.tierListPlacement as any,
        verification: character.verification as any,
        views: 0,
        popularity: character.popularity,
        winRate: character.winRate,
      },
    });
    console.log(`  ✅ Created character: ${character.name}`);
  }

  console.log(`\n✅ Seed completed successfully!`);
  console.log(`   Total characters: ${characters.length}`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

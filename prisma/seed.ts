import { PrismaClient } from '@prisma/client';
import { characters } from '@/data/games/destiny-rising/characters';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing data
  console.log('🗑️  Clearing existing characters...');
  await prisma.character.deleteMany();

  // Insert characters from CharacterSummary data
  console.log('📝 Inserting characters...');
  for (const character of characters) {
    await prisma.character.create({
      data: {
        slug: character.slug,
        name: character.name,
        title: character.title,
        description: `${character.name} — ${character.title}. A ${character.rarity} ${character.element} ${character.role} from the ${character.faction} faction.`,
        gameId: 'destiny-rising',
        element: character.element,
        role: character.role,
        rarity: character.rarity,
        weaponType: character.weaponType,
        faction: character.faction,
        damageType: character.element === 'Fire' ? 'Physical' : character.element,
        icon: character.icon,
        portrait: character.portrait,
        splashArt: character.portrait.replace('portrait', 'splash'),
        colorTheme: character.colorTheme,
        stats: {
          baseHP: 1000 + Math.floor(Math.random() * 500),
          baseATK: 200 + Math.floor(Math.random() * 100),
          baseDEF: 150 + Math.floor(Math.random() * 50),
          baseSPD: 90 + Math.floor(Math.random() * 20),
          baseCR: 5.0 + Math.random() * 10,
          baseCD: 50.0 + Math.random() * 50,
          growthHP: 80 + Math.floor(Math.random() * 40),
          growthATK: 15 + Math.floor(Math.random() * 10),
          growthDEF: 10 + Math.floor(Math.random() * 8),
          growthSPD: 0,
        },
        skills: [
          {
            id: `${character.slug}-basic`,
            name: `${character.name}'s Strike`,
            description: `Basic attack dealing ${character.element} damage.`,
            type: 'basic',
            element: character.element,
            damageType: 'Physical',
            scaling: [
              { level: 1, value: '100%', description: '100% ATK' },
              { level: 6, value: '150%', description: '150% ATK' },
              { level: 10, value: '200%', description: '200% ATK' },
            ],
            icon: `/skills/${character.slug}/basic.png`,
          },
          {
            id: `${character.slug}-skill`,
            name: `${character.name}'s Skill`,
            description: `Elemental skill unleashing ${character.element} power.`,
            type: 'skill',
            element: character.element,
            damageType: character.element,
            cooldown: 10,
            scaling: [
              { level: 1, value: '250%', description: '250% ATK' },
              { level: 6, value: '375%', description: '375% ATK' },
              { level: 10, value: '500%', description: '500% ATK' },
            ],
            icon: `/skills/${character.slug}/skill.png`,
          },
        ],
        talents: [
          {
            id: `${character.slug}-talent-1`,
            name: 'Enhanced Stats',
            description: `Increases ATK by 10% for ${character.element} allies.`,
            unlockLevel: 1,
            tier: 1,
            effects: ['ATK +10%'],
          },
        ],
        ultimate: {
          id: `${character.slug}-ultimate`,
          name: `${character.name}'s Fury`,
          description: `Unleashes devastating ${character.element} damage to all enemies.`,
          type: 'ultimate',
          element: character.element,
          damageType: character.element,
          energyCost: 80,
          scaling: [
            { level: 1, value: '500%', description: '500% ATK' },
            { level: 6, value: '750%', description: '750% ATK' },
            { level: 10, value: '1000%', description: '1000% ATK' },
          ],
          icon: `/skills/${character.slug}/ultimate.png`,
        },
        passive: {
          id: `${character.slug}-passive`,
          name: `${character.name}'s Will`,
          description: `Passive: ${character.element} damage increased by 15%.`,
          type: 'passive',
          element: character.element,
          damageType: character.element,
          scaling: [],
          icon: `/skills/${character.slug}/passive.png`,
        },
        ascensionMaterials: [],
        skillMaterials: [],
        maxLevel: 90,
        maxAscension: 6,
        recommendedWeapons: [],
        recommendedArtifacts: [],
        synergies: [],
        counters: [],
        popularBuilds: [],
        strengths: [
          { description: `Strong ${character.element} damage output`, category: 'damage' as any },
        ],
        weaknesses: [
          { description: `Vulnerable to crowd control`, category: 'survivability' as any },
        ],
        lore: `${character.name}, known as ${character.title}, is a legendary ${character.role} from the ${character.faction} faction.`,
        voiceActors: {
          en: 'TBA',
          jp: 'TBA',
          kr: 'TBA',
          cn: 'TBA',
        },
        factionRelation: {
          factionId: character.faction.toLowerCase(),
          role: 'member',
          lore: `${character.name} is a valued member of the ${character.faction} faction.`,
        },
        releaseVersion: character.releaseVersion,
        tierListPlacement: {
          overall: character.tierListPlacement,
          dps: character.role === 'DPS' ? character.tierListPlacement : 'A',
          support: character.role === 'Support' ? character.tierListPlacement : 'B',
          pve: character.tierListPlacement,
          pvp: 'A',
        },
        verification: {
          verified: character.verification.verified,
          gameVersion: character.verification.gameVersion,
        },
        views: 0,
        popularity: character.popularity,
        pickRate: 0,
        banRate: 0,
        winRate: character.winRate,
      },
    });
  }

  console.log(`✅ ${characters.length} characters seeded successfully!`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

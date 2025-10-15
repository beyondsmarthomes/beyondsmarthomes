import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  await prisma.user.upsert({
    where: { email: 'demo@beyondsmarthomes.com' },
    update: {},
    create: { email: 'demo@beyondsmarthomes.com', name: 'Demo User' },
  })

  const lighting = await prisma.category.upsert({
    where: { slug: 'lighting' },
    update: {},
    create: { name: 'Lighting', slug: 'lighting' },
  })
  const security = await prisma.category.upsert({
    where: { slug: 'security' },
    update: {},
    create: { name: 'Security', slug: 'security' },
  })

  await prisma.product.upsert({
    where: { slug: 'smart-bulb-pro' },
    update: {},
    create: {
      name: 'Smart Bulb Pro',
      slug: 'smart-bulb-pro',
      description: 'Dimmable, color, Matter-compatible',
      price: 2999,
      imageUrl: '/window.svg',
      categoryId: lighting.id,
    },
  })

  await prisma.product.upsert({
    where: { slug: 'doorbell-4k' },
    update: {},
    create: {
      name: 'Doorbell 4K',
      slug: 'doorbell-4k',
      description: 'Sharp video + two-way audio',
      price: 14999,
      imageUrl: '/window.svg',
      categoryId: security.id,
    },
  })
}

main().then(() => prisma.$disconnect()).catch(async (e) => {
  console.error(e)
  await prisma.$disconnect()
  process.exit(1)
})

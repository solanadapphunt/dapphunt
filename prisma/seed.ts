import { PrismaClient } from '../generated/prisma'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Clear existing data
  await prisma.vote.deleteMany()
  await prisma.launch.deleteMany()
  await prisma.project.deleteMany()
  await prisma.submission.deleteMany()
  await prisma.forumPost.deleteMany()
  await prisma.forumThread.deleteMany()
  await prisma.session.deleteMany()
  await prisma.account.deleteMany()
  await prisma.user.deleteMany()

  console.log('🧹 Cleared existing data')

  // Create demo user for voting
  const demoUser = await prisma.user.create({
    data: {
      id: 'demo-user-1',
      email: 'demo@dapphunt.com',
      name: 'Demo User',
      username: 'demo',
      role: 'USER',
    },
  })

  console.log('👤 Created demo user:', demoUser.email)

  // Create categories
  const categories = [
    { name: 'DeFi', slug: 'defi', description: 'Decentralized Finance applications', color: '#10B981' },
    { name: 'NFTs', slug: 'nfts', description: 'Non-Fungible Token platforms', color: '#8B5CF6' },
    { name: 'Gaming', slug: 'gaming', description: 'Blockchain gaming and metaverse', color: '#F59E0B' },
    { name: 'Infrastructure', slug: 'infrastructure', description: 'Developer tools and infrastructure', color: '#3B82F6' },
    { name: 'Social', slug: 'social', description: 'Social platforms and communication', color: '#EF4444' },
    { name: 'Marketplace', slug: 'marketplace', description: 'Trading and marketplace platforms', color: '#06B6D4' },
  ]

  console.log('📂 Created categories')

  for (const categoryData of categories) {
    await prisma.category.upsert({
      where: { slug: categoryData.slug },
      update: categoryData,
      create: categoryData,
    })
  }

  // Create a few sample forum threads (optional)
  const defiCategory = await prisma.category.findUnique({ where: { slug: 'defi' } })
  
  if (defiCategory) {
    await prisma.forumThread.create({
      data: {
        title: 'Welcome to DappHunt! 🚀',
        content: 'Share your amazing Solana dapps with the community!',
        category: 'General',
        isHot: true,
        authorId: demoUser.id,
      },
    })

    console.log('💬 Created welcome forum thread')
  }

  console.log('✅ Database seeded successfully!')
  console.log('🎯 Ready for fresh project submissions!')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 
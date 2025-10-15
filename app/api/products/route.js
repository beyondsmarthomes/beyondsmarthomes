import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
export async function GET() {
  const products = await prisma.product.findMany({ orderBy: { createdAt: 'desc' }, take: 10 })
  return new Response(JSON.stringify(products), { headers: { 'content-type': 'application/json' } })
}

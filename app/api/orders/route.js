import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
export async function GET() {
  const orders = await prisma.order.findMany({ orderBy: { createdAt: 'desc' }, take: 20 })
  return new Response(JSON.stringify(orders), { headers: { 'content-type': 'application/json' } })
}

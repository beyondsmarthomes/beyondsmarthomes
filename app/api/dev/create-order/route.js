import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
export async function POST(req) {
  const { chargeId, total } = await req.json()
  if (!chargeId) return new Response('chargeId required', { status: 400 })
  const order = await prisma.order.create({ data: { status: 'PENDING', total: Number(total||0), tapChargeId: String(chargeId) } })
  return new Response(JSON.stringify(order), { headers: { 'content-type': 'application/json' } })
}

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
export async function POST(req) {
  const secret = req.headers.get('x-tap-secret') || new URL(req.url).searchParams.get('secret')
  if (!secret || secret !== process.env.TAP_SECRET) return new Response('unauthorized', { status: 401 })
  const { chargeId } = await req.json()
  if (!chargeId) return new Response('chargeId required', { status: 400 })
  const res = await prisma.order.updateMany({ where: { tapChargeId: String(chargeId) }, data: { status: 'PAID' } })
  return new Response(JSON.stringify({ updated: res.count }), { headers: { 'content-type': 'application/json' } })
}

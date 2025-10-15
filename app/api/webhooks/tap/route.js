import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
export async function POST(req) {
  const secret = req.headers.get('x-tap-secret')
  if (!secret || secret !== process.env.TAP_SECRET) return new Response('unauthorized', { status: 401 })
  let payload
  try { payload = await req.json() } catch { return new Response('bad json', { status: 400 }) }
  const chargeId = payload?.id || payload?.charge?.id || payload?.reference?.id || payload?.transaction?.id || null
  const status = String(payload?.status || payload?.charge?.status || '').toUpperCase()
  if (!chargeId) return new Response('missing charge id', { status: 400 })
  if (['PAID','CAPTURED','SUCCEEDED','SUCCESS'].includes(status)) {
    await prisma.order.updateMany({ where: { tapChargeId: chargeId }, data: { status: 'PAID', updatedAt: new Date() } })
  }
  return new Response('ok', { status: 200 })
}

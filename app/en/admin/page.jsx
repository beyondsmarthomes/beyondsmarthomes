export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function markPaid(prevState, formData) {'use server'; const id = String(formData.get('id')||''); await prisma.order.update({ where: { id }, data: { status: 'PAID' } }); return {}}
async function cancelOrder(prevState, formData) {'use server'; const id = String(formData.get('id')||''); await prisma.order.update({ where: { id }, data: { status: 'CANCELLED' } }); return {}}
export default async function Admin({ searchParams }) {
  if ((searchParams?.key||'') !== process.env.ADMIN_KEY) return <div className='text-red-600'>Unauthorized</div>
  const orders = await prisma.order.findMany({ orderBy: { createdAt: 'desc' }, take: 50, include: { items: true, user: true } })
  return (
    <section className='max-w-6xl space-y-4'>
      <h1 className='text-3xl font-bold'>Admin • Orders</h1>
      <div className='overflow-x-auto border rounded-xl'>
        <table className='min-w-full text-sm'>
          <thead className='bg-gray-50'>
            <tr>
              <th className='p-3 text-left'>Created</th>
              <th className='p-3 text-left'>Status</th>
              <th className='p-3 text-left'>Total</th>
              <th className='p-3 text-left'>Charge ID</th>
              <th className='p-3 text-left'>User</th>
              <th className='p-3 text-left'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(o=>(
              <tr key={o.id} className='border-t'>
                <td className='p-3'>{new Date(o.createdAt).toLocaleString()}</td>
                <td className='p-3'>{o.status}</td>
                <td className='p-3'>{(o.total/100).toFixed(2)} KWD</td>
                <td className='p-3 font-mono text-xs'>{o.tapChargeId||'-'}</td>
                <td className='p-3'>{o.user?.email||'-'}</td>
                <td className='p-3 flex gap-2'>
                  <form action={markPaid}><input type='hidden' name='id' defaultValue={o.id} /><button className='px-3 py-1 rounded bg-green-600 text-white'>Mark Paid</button></form>
                  <form action={cancelOrder}><input type='hidden' name='id' defaultValue={o.id} /><button className='px-3 py-1 rounded bg-red-600 text-white'>Cancel</button></form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

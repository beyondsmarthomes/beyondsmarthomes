import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
export default async function ShopPage() {
  const products = await prisma.product.findMany({ orderBy: { createdAt: 'desc' } })
  return (
    <section className="max-w-5xl" dir="rtl">
      <h1 className="text-3xl font-bold mb-2">المتجر</h1>
      <p className="text-gray-600 mb-6">أجهزة وخدمات تركيب مختارة بعناية.</p>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map(p => (
          <li key={p.id} className="border rounded-xl p-4">
            <div className="aspect-video bg-gray-50 rounded mb-3 flex items-center justify-center overflow-hidden">
              <img src={p.imageUrl || '/window.svg'} alt="" className="max-h-full max-w-full" />
            </div>
            <h3 className="font-semibold">{p.name}</h3>
            <p className="text-sm text-gray-600">{p.description || ''}</p>
            <div className="mt-2 font-medium">{(p.price/100).toFixed(2)} KWD</div>
          </li>
        ))}
      </ul>
    </section>
  )
}

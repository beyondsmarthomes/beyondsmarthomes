import en from '@/src/messages/en.json'
import ar from '@/src/messages/ar.json'
export default function Home({ params }) {
  const t = params.locale === 'ar' ? ar : en
  return (
    <section className="space-y-4">
      <h1 className="text-3xl font-bold">{t.siteName}</h1>
      <p className="text-gray-600">End-to-end smart home integration. Private, fast, and reliable.</p>
      <div className="flex gap-3">
        <a href={`/${params.locale}/about`} className="px-4 py-2 rounded bg-black text-white">About</a>
        <a href={`/${params.locale}/projects`} className="px-4 py-2 rounded border">Projects</a>
      </div>
    </section>
  )
}

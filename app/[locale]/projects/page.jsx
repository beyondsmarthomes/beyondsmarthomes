import Link from 'next/link'
import en from '@/src/messages/en.json'
import ar from '@/src/messages/ar.json'
export default function Projects({ params }) {
  const t = params.locale === 'ar' ? ar : en
  return (
    <section className="max-w-3xl">
      <h1 className="text-3xl font-bold">{t.projects.title}</h1>
      <p className="text-gray-600 mt-2">{t.projects.intro}</p>
      <ul className="mt-6 grid gap-4 sm:grid-cols-2">
        {t.projects.items.map(p => (
          <li key={p.slug} className="border rounded-lg p-4">
            <h3 className="font-semibold">{p.title}</h3>
            <p className="text-sm text-gray-600">{p.summary}</p>
            <Link className="underline mt-2 inline-block" href={`/${params.locale}/projects/${p.slug}`}>View</Link>
          </li>
        ))}
      </ul>
    </section>
  )
}

import en from '@/src/messages/en.json'
import ar from '@/src/messages/ar.json'
export default function About({ params }) {
  const t = params.locale === 'ar' ? ar : en
  return (
    <article className="max-w-2xl space-y-4">
      <h1 className="text-3xl font-bold">{t.about.title}</h1>
      <h2 className="text-lg text-gray-600">{t.about.subtitle}</h2>
      <div className="space-y-3">
        {t.about.body.map((p, i) => <p key={i}>{p}</p>)}
      </div>
      <section className="mt-6">
        <h3 className="text-xl font-semibold">{t.about.team.title}</h3>
        <p className="mt-1">{t.about.team.name} — {t.about.team.role}</p>
      </section>
    </article>
  )
}

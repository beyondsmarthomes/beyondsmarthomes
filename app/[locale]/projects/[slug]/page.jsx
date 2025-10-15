import en from '@/src/messages/en.json'
import ar from '@/src/messages/ar.json'
import Gallery from '@/components/Gallery'
export default function ProjectDetail({ params }) {
  const t = params.locale === 'ar' ? ar : en
  const item = t.projects.items.find(x => x.slug === params.slug)
  if (!item) return <div className="text-red-600">Not found</div>
  return (
    <article className="max-w-3xl space-y-4">
      <a href={`/${params.locale}/projects`} className="underline">Back to projects</a>
      <h1 className="text-3xl font-bold">{item.title}</h1>
      <p className="text-gray-600">{item.summary}</p>
      <Gallery images={item.images} />
    </article>
  )
}

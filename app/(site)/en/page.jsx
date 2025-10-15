import en from '@/src/messages/en.json'
export default function Home() {
  const t = en
  return (
    <section className="relative overflow-hidden rounded-2xl p-8 sm:p-12 bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white">
      <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
      <div className="max-w-5xl relative z-10 grid gap-8 sm:grid-cols-[1fr,280px]">
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="logo" className="h-12 w-12 rounded" />
            <span className="text-lg text-white/80">{t.siteName}</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight">Private, fast, and reliable smart homes</h1>
          <p className="text-white/80 max-w-prose">End-to-end integration. Local-first automations that don’t slow your Wi-Fi and respond instantly.</p>
          <div className="flex gap-3">
            <a href="/en/shop" className="px-5 py-3 rounded-lg bg-white text-black font-medium">Shop</a>
            <a href="/en/projects" className="px-5 py-3 rounded-lg border border-white/30">Projects</a>
          </div>
        </div>
        <div className="hidden sm:block">
          <div className="h-full w-full rounded-xl bg-white/5 border border-white/10 backdrop-blur flex items-center justify-center">
            <img src="/window.svg" alt="" className="h-28 w-28 opacity-80" />
          </div>
        </div>
      </div>
    </section>
  )
}

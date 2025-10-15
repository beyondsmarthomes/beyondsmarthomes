import ar from '@/src/messages/ar.json'
export default function Home() {
  const t = ar
  return (
    <section className="relative overflow-hidden rounded-2xl p-8 sm:p-12 bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white" dir="rtl">
      <div className="absolute -left-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
      <div className="max-w-5xl relative z-10 grid gap-8 sm:grid-cols-[1fr,280px]">
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="logo" className="h-12 w-12 rounded" />
            <span className="text-lg text-white/80">{t.siteName}</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight">منازل ذكية خاصة وسريعة وموثوقة</h1>
          <p className="text-white/80 max-w-prose">تكامل متكامل من البداية للنهاية. أتمتة تعمل محليًا ولا تُبطئ الشبكة مع استجابة فورية.</p>
          <div className="flex gap-3">
            <a href="/ar/shop" className="px-5 py-3 rounded-lg bg-white text-black font-medium">المتجر</a>
            <a href="/ar/projects" className="px-5 py-3 rounded-lg border border-white/30">المشاريع</a>
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

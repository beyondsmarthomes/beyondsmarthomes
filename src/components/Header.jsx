export default function Header({ locale }) {
  const isAr = locale === 'ar'
  const t = isAr
    ? { site:'بيوند سمارت هومز', about:'من نحن', projects:'المشاريع', shop:'المتجر', admin:'Admin', login:'دخول', switch:'EN' }
    : { site:'Beyond Smart Homes', about:'About', projects:'Projects', shop:'Shop', admin:'Admin', login:'Login', switch:'عربي' }
  const prefix = isAr ? '/ar' : '/en'
  return (
    <header className="p-6 border-b flex items-center justify-between" dir={isAr ? 'rtl' : 'ltr'}>
      <a href={prefix} className="font-semibold flex items-center gap-2">
        <img src="/logo.png" alt="logo" className="h-8 w-8" />
        <span>{t.site}</span>
      </a>
      <nav className="flex gap-4 items-center">
        <a href={`${prefix}/about`} className="underline">{t.about}</a>
        <a href={`${prefix}/projects`} className="underline">{t.projects}</a>
        <a href={`${prefix}/shop`} className="underline">{t.shop}</a>
        <a href={`/en/admin`} className="px-3 py-1 rounded border">{t.admin}</a>
        <a href={`${prefix}/login`} className="px-3 py-1 rounded border">{t.login}</a>
        <a href={isAr ? '/en' : '/ar'} className="px-3 py-1 rounded border">{t.switch}</a>
      </nav>
    </header>
  )
}

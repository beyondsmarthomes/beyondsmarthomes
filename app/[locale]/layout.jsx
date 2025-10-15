import '../globals.css'
export default function LocaleLayout({ children, params }) {
  const locale = params.locale || 'en'
  const dir = locale === 'ar' ? 'rtl' : 'ltr'
  return (
    <html lang={locale} dir={dir}>
      <body className="min-h-screen">
        <header className="p-6 border-b flex items-center justify-between">
          <a href={`/${locale}`} className="font-semibold">Beyond Smart Homes</a>
          <nav className="flex gap-4">
            <a href={`/${locale}/about`} className="underline">About</a>
            <a href={`/${locale}/projects`} className="underline">Projects</a>
          </nav>
        </header>
        <main className="p-6">{children}</main>
        <footer className="p-6 border-t text-sm text-gray-500">© Beyond Smart Homes</footer>
      </body>
    </html>
  )
}

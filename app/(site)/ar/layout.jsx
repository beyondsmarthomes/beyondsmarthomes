import '../globals.css'
export default function LocaleLayout({ children }) {
  const locale = 'ar'
  return (
    <html lang={locale} dir="rtl">
      <body className="min-h-screen">
        <header className="p-6 border-b flex items-center justify-between">
          <a href="/ar" className="font-semibold flex items-center gap-2">
            <img src="/logo.png" alt="logo" className="h-8 w-8" />
            <span>بيوند سمارت هومز</span>
          </a>
          <nav className="flex gap-4 items-center">
            <a href="/ar/about" className="underline">من نحن</a>
            <a href="/ar/projects" className="underline">المشاريع</a>
            <a href="/ar/shop" className="underline">المتجر</a>
            <a href="/en" className="px-3 py-1 rounded border">EN</a>
          </nav>
        </header>
        <main className="p-6">{children}</main>
        <footer className="p-6 border-t text-sm text-gray-500">© بيوند سمارت هومز</footer>
      </body>
    </html>
  )
}

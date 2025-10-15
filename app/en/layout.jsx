import '../globals.css'
export default function LocaleLayout({ children }) {
  const locale = 'en'
  return (
    <html lang={locale} dir="ltr">
      <body className="min-h-screen">
        <header className="p-6 border-b flex items-center justify-between">
          <a href="/en" className="font-semibold flex items-center gap-2">
            <img src="/logo.png" alt="logo" className="h-8 w-8" />
            <span>Beyond Smart Homes</span>
          </a>
          <nav className="flex gap-4 items-center">
            <a href="/en/about" className="underline">About</a>
            <a href="/en/projects" className="underline">Projects</a>
            <a href="/en/shop" className="underline">Shop</a>
            <a href="/ar" className="px-3 py-1 rounded border">عربي</a>
          </nav>
        </header>
        <main className="p-6">{children}</main>
        <footer className="p-6 border-t text-sm text-gray-500">© Beyond Smart Homes</footer>
      </body>
    </html>
  )
}

import '../../globals.css'

export default function AdminLayout({ children }) {
  return (
    <html lang="en" dir="ltr">
      <body className="min-h-screen">
        <header className="p-6 border-b flex items-center justify-between">
          <a href="/en" className="font-semibold">Beyond Smart Homes</a>
          <nav className="flex gap-4 items-center">
            <a href="/en" className="underline">Home</a>
            <a href="/en/projects" className="underline">Projects</a>
            <a href="/en/shop" className="underline">Shop</a>
          </nav>
        </header>
        <main className="p-6">{children}</main>
        <footer className="p-6 border-t text-sm text-gray-500">© Beyond Smart Homes</footer>
      </body>
    </html>
  )
}

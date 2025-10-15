export default function AdminLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header className="p-6 border-b flex items-center justify-between">
          <a href="/en" className="font-semibold">Beyond Smart Homes</a>
          <nav className="flex gap-4 items-center">
            <a href="/en">Home</a>
            <a href="/en/projects">Projects</a>
            <a href="/en/shop">Shop</a>
            <span className="px-3 py-1 rounded bg-black text-white">Admin</span>
          </nav>
        </header>
        <main className="p-6">{children}</main>
        <footer className="p-6 border-t text-sm text-gray-500">© Beyond Smart Homes</footer>
      </body>
    </html>
  )
}

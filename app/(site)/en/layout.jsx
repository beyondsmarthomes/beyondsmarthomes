import '../globals.css'
import Header from '@/src/components/Header'
export default function LocaleLayout({ children }) {
  return (
    <html lang="en" dir="ltr">
      <body className="min-h-screen">
        <Header locale="en" />
        <main className="p-6">{children}</main>
        <footer className="p-6 border-t text-sm text-gray-500">© Beyond Smart Homes</footer>
      </body>
    </html>
  )
}

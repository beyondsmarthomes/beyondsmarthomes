import '../globals.css'
import Header from '@/src/components/Header'
export default function LocaleLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body className="min-h-screen">
        <Header locale="ar" />
        <main className="p-6">{children}</main>
        <footer className="p-6 border-t text-sm text-gray-500" dir="rtl">© بيوند سمارت هومز</footer>
      </body>
    </html>
  )
}

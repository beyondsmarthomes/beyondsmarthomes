import Header from '@/src/components/Header'
export default function AdminLayout({ children }) {
  return (
    <html lang="en" dir="ltr">
      <body className="min-h-screen">
        <Header locale="en" />
        <main className="p-6">{children}</main>
      </body>
    </html>
  )
}

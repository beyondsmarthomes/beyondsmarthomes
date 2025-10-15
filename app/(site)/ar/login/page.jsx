export default function Login() {
  return (
    <section className="max-w-sm space-y-4" dir="rtl">
      <h1 className="text-2xl font-bold">تسجيل الدخول</h1>
      <p>هذه صفحة مؤقتة. يمكننا تفعيل تسجيل الدخول الحقيقي لاحقًا.</p>
      <form className="space-y-3">
        <input className="w-full border rounded px-3 py-2" placeholder="البريد الإلكتروني" />
        <input type="password" className="w-full border rounded px-3 py-2" placeholder="كلمة المرور" />
        <button className="px-4 py-2 rounded bg-black text-white" type="button">متابعة</button>
      </form>
    </section>
  )
}

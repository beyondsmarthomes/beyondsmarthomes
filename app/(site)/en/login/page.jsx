export default function Login() {
  return (
    <section className="max-w-sm space-y-4">
      <h1 className="text-2xl font-bold">Login</h1>
      <p>This is a placeholder. We can wire real auth (NextAuth) when you’re ready.</p>
      <form className="space-y-3">
        <input className="w-full border rounded px-3 py-2" placeholder="Email" />
        <input type="password" className="w-full border rounded px-3 py-2" placeholder="Password" />
        <button className="px-4 py-2 rounded bg-black text-white" type="button">Continue</button>
      </form>
    </section>
  )
}

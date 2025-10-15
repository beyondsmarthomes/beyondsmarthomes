import { NextResponse } from 'next/server'
export function middleware(req) {
  const url = new URL(req.url)
  if (url.pathname === '/') {
    url.pathname = '/en'
    return NextResponse.redirect(url)
  }
  return NextResponse.next()
}
export const config = { matcher: ['/'] }

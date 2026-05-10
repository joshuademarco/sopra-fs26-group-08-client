import { NextRequest, NextResponse } from 'next/server'

const AUTH_TOKEN_COOKIE = 'token'

export function middleware(request: NextRequest) {
  const { nextUrl } = request
  const pathname = nextUrl.pathname

  if (!pathname.startsWith('/app')) {
    return NextResponse.next()
  }

  const token = request.cookies.get(AUTH_TOKEN_COOKIE)?.value

  if (!token) {
    const url = nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/app/:path*'],
}

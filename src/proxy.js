import { NextResponse } from 'next/server';

const REDIRECT_HOSTS = new Set(['naturatech.org', 'www.naturatech.org']);
const LANGUAGE_COOKIE = 'nt-lang';

export function proxy(request) {
  const host = request.headers.get('host')?.split(':')[0].toLowerCase();
  const pathname = request.nextUrl.pathname.replace(/\/$/, '') || '/';

  if (pathname === '/en') {
    const url = request.nextUrl.clone();
    url.pathname = '/';
    url.search = '';

    const response = NextResponse.redirect(url, 307);
    response.cookies.set(LANGUAGE_COOKIE, 'en', {
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
      sameSite: 'lax',
    });

    return response;
  }

  if (host && REDIRECT_HOSTS.has(host)) {
    return NextResponse.redirect('https://500.naturatech.org', 308);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/500', '/500/', '/en', '/en/'],
};

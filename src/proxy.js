import { NextResponse } from 'next/server';

const REDIRECT_HOSTS = new Set(['naturatech.org', 'www.naturatech.org']);

export function proxy(request) {
  const host = request.headers.get('host')?.split(':')[0].toLowerCase();

  if (host && REDIRECT_HOSTS.has(host)) {
    return NextResponse.redirect('https://500.naturatech.org', 308);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/500', '/500/'],
};

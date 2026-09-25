import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { routing } from './i18n/routing';

// دول عربية → نعرضو ar بشكل تلقائي
const ARABIC_COUNTRIES = new Set([
  'SA', 'AE', 'EG', 'KW', 'QA', 'BH', 'OM', 'JO',
  'LB', 'IQ', 'SY', 'YE', 'LY', 'TN', 'DZ', 'MA', 'SD', 'PS'
]);

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const hasLocaleCookie = request.cookies.has('NEXT_LOCALE');

  if (!hasLocaleCookie) {
    const country = request.headers.get('x-vercel-ip-country') ?? '';
    const detectedLocale = ARABIC_COUNTRIES.has(country) ? 'ar' : 'en';

    const pathnameHasLocale = routing.locales.some(
      (locale) =>
        request.nextUrl.pathname.startsWith(`/${locale}/`) ||
        request.nextUrl.pathname === `/${locale}`
    );

    if (!pathnameHasLocale) {
      const url = request.nextUrl.clone();
      url.pathname = `/${detectedLocale}${request.nextUrl.pathname}`;
      const response = NextResponse.redirect(url);
      response.cookies.set('NEXT_LOCALE', detectedLocale);
      return response;
    }
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};

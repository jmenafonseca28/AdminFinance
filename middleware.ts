import { updateSession } from '@/utils/supabase/middleware';
import { CookieOptions, createServerClient } from '@supabase/ssr';
import { type NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest): Promise<NextResponse> {
  const supabaseResponse = await updateSession(request);

  const { pathname } = request.nextUrl;

  const protectedRoutes: string[] = ['/pages/home', '/pages/profile'];

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: (): { name: string; value: string }[] => request.cookies.getAll(),
        setAll: (cookiesToSet: { name: string; value: string; options?: CookieOptions }[]): void => {
          cookiesToSet.forEach(({ name, value, options }) => {
            if (options) {
              request.cookies.set({ name, value, ...options });
            } else {
              request.cookies.set(name, value);
            }
          });
        },
      },
    }
  );

  const { data: { user: session }, } = await supabase.auth.getUser();

  if (protectedRoutes.includes(pathname) && !session) {
    return NextResponse.redirect(new URL('/pages/login', request.url));
  }

  if (session && pathname === '/pages/login') {
    return NextResponse.redirect(new URL('/pages/home', request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

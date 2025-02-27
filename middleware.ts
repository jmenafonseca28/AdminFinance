//import { updateSession } from '@/utils/supabase/middleware';
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { type NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest): Promise<NextResponse> {
  console.log('Middleware executed', request);
  //const supabaseResponse = await updateSession(request);

  const response = NextResponse.next();
  const supabase = createMiddlewareClient({ req: request, res: response });

  await supabase.auth.getSession();
  const { data: { user } } = await supabase.auth.getUser();
  
  const { pathname } = request.nextUrl;
  const protectedRoutes: string[] = ['/pages/home', '/pages/profile'];

  if (protectedRoutes.includes(pathname) && !user) {
    return NextResponse.redirect(new URL('/pages/login', request.url));
  }

  if (user && pathname === '/pages/login') {
    return NextResponse.redirect(new URL('/pages/home', request.url));
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

//import { updateSession } from '@/utils/supabase/middleware';
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { type NextRequest, NextResponse } from 'next/server';
import { Routes } from "./app/constants/Routes";

export async function middleware(request: NextRequest): Promise<NextResponse> {
  //const supabaseResponse = await updateSession(request);

  const response = NextResponse.next();
  const supabase = createMiddlewareClient({ req: request, res: response });

  await supabase.auth.getSession();
  const { data: { user } } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const protectedRoutes: string[] = [Routes.HOME, Routes.PROFILE];

  if (protectedRoutes.includes(pathname) && !user) {
    return NextResponse.redirect(new URL(Routes.LOGIN, request.url));
  }

  if (user && (pathname === Routes.LOGIN || pathname === '/')) {
    return NextResponse.redirect(new URL(Routes.HOME, request.url));
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

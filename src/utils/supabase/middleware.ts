//Código obtenido de: https://supabase.com/docs/guides/auth/server-side/nextjs
import { Routes } from '@/app/constants/Routes'
import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from './server'

export async function updateSession(request: NextRequest) {
    const supabaseResponse = NextResponse.next({
        request,
    })

    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    const protectedRoutes: string[] = [Routes.HOME, Routes.PROFILE];
    const { pathname } = request.nextUrl;

    if (protectedRoutes.includes(pathname) && !user) {
        return NextResponse.redirect(new URL(Routes.LOGIN, request.url));
    }

    if (user && (pathname === Routes.LOGIN || pathname === '/')) {
        return NextResponse.redirect(new URL(Routes.HOME, request.url));
    }

    if (!user && !Object.values(Routes).includes(pathname)) { //Permite que el usuario no vaya a rutas que no existen
        return NextResponse.redirect(new URL(Routes.LOGIN, request.url));
    }

    return supabaseResponse;
}
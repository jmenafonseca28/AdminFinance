/* import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    //eslint-disable-next-line
                    cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value));
                    supabaseResponse = NextResponse.next({
                        request,
                    });
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    );
                },
            },
        }
    );

    const { data: { user }, error } = await supabase.auth.getUser();

    if (error) {
        console.log("User: ", user);
        console.error('Error al obtener el usuario:', error.message);
    } else {
        console.log('Usuario autenticado:', user);
    }

    if (!user && !request.nextUrl.pathname.startsWith('/pages/login')) {
        const url = request.nextUrl.clone();
        url.pathname = '/pages/login';
        return NextResponse.redirect(url);
    }

    return supabaseResponse;
} */
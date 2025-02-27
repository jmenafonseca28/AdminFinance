//import { supabase } from './SupabaseClientService';
//import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { supabase } from './ClientServiceSupabase';
import UserLogin from '@/app/models/UserLogin.model';

export async function login(user: UserLogin) {
    const { email, password } = user;
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    console.log("Info ", data, error);
    if (error) {
        console.error('Error al iniciar sesión:', error.message);
        return null;
    }

    if (data.session) {
        await supabase.auth.setSession({
            access_token: data.session.access_token,
            refresh_token: data.session.refresh_token,
        });
    }

    return data;
}

export async function logout() {
    const { error } = await supabase.auth.signOut();

    if (error) {
        console.error("Error", error.message);
        return;
    }
}
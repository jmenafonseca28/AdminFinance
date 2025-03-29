import { supabase } from './ClientServiceSupabase';
import UserLogin from '@/app/models/UserLogin.model';

export async function login(user: UserLogin) {
    const { email, password } = user;
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
        console.error('Error al iniciar sesión:', error.message);
        return null;
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
import { supabase } from './ClientServiceSupabase';
import UserLogin from '@/app/models/UserLogin.model';
import User from '../models/User.model';
import UserRegister from '../models/UserRegister.model';
import { log } from "@/app/custom/EventLog";

export async function login(user: UserLogin) {
    const { email, password } = user;
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
        await log("Error al iniciar sesión", error);
        throw error;
    }

    return data;
}

export async function logout() {
    const { error } = await supabase.auth.signOut();

    if (error) {
        await log("Error al cerrar sesión", error);
        return;
    }
}


export async function register(user: UserRegister) {

    const { email, password, name, lastName } = user;
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                name,
                lastName
            }
        }
    });
    if (error) {
        await log("Error al registrar usuario", error);
        throw error;
    }
    return data;
}


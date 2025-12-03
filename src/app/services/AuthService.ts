import { supabase } from './ClientServiceSupabase';
import UserLogin from '@/app/models/UserLogin.model';

import UserRegister from '../models/UserRegister.model';
import { log } from "@/app/custom/EventLog";

export async function login({ email, password }: UserLogin) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {

        if (error.message.includes("Email not confirmed")) {
            throw new Error("El correo no ha sido confirmado. Por favor verifica tu bandeja de entrada.");
        }
        throw error;
    }

    return data.user;
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


import { supabase } from './ClientServiceSupabase';
import UserLogin from '@/app/models/UserLogin.model';
import User from '../models/User.model';
import UserRegister from '../models/UserRegister.model';
import { createNewUserProfile } from "./UserProfilesService";
import { log } from "@/app/custom/EventLog";
export async function login(user: UserLogin) {
    const { email, password } = user;
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
        log("Errorr al iniciar sesión", error);
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
    const { data, error } = await supabase.auth.signUp({ email, password });

    if (data.user) {
        await supabase.from("userprofiles")
            .update({ name, lastName })
            .eq("id", data.user.id);
    }
    if (error) {
        log("Error al registrar usuario", error);
        throw error;
    }
    return data;
}


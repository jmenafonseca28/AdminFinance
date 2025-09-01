import { supabase } from './ClientServiceSupabase';
import UserLogin from '@/app/models/UserLogin.model';
import User from '../models/User.model';
import UserRegister from '../models/UserRegister.model';
import { createNewUserProfile } from "./UserProfilesService";

export async function login(user: UserLogin) {
    const { email, password } = user;
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) throw error;

    return data;
}

export async function logout() {
    const { error } = await supabase.auth.signOut();

    if (error) {
        console.error("Error", error.message);
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
    if (error) throw error;
    console.log("User registered:", data);
    return data;
}


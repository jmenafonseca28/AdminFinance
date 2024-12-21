import type UserLogin from '../models/UserLogin.model';
import { supabase } from './SupabaseClientService';
import { verifyFields } from '../scripts/Verifications';

async function login(user: UserLogin) {

    if (!user || !verifyFields(user.email, user.password)) {
        console.error("Campos incorrectos");
        return;
    }

    const response = await supabase.auth.signInWithPassword(user).then((response) => {
        console.log("Éxito", response);
        return response;
    }).catch((error) => {
        console.error("Error", error);
        return error;
    });

    return response;
}

async function logout() {

    const { error } = await supabase.auth.signOut();

    if (error) {
        console.error("Error", Error);
        return;
    }

}

async function getUser() {

    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
        console.log("Usuario", user);
        return user;
    }

    return null;
}

export { login, logout, getUser };
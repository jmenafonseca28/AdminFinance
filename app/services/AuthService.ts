import type UserLogin from '../models/UserLogin.model';
import { supabase } from './SupabaseClientService';
import { verifyFields } from '../scripts/Verifications';

async function login(user: UserLogin) {
    console.log("login", user);

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

function logout() { }

export { login, logout };
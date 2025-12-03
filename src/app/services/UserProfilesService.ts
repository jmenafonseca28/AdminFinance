import { supabase } from "./ClientServiceSupabase";
import { log } from "@/app/custom/EventLog";
import { Routes } from "@/app/constants/Routes";
import { createClient } from "@/utils/supabase/client";
async function getBalanceForLoggedUser() {
    try {
        // Obtener el usuario autenticado
        const { data: authData, error: authError } = await supabase.auth.getUser();

        if (authError || !authData?.user?.id) {
            if (authError) {
                await log("Error obteniendo usuario", new Error(authError.message));
            }
            return null;
        }


        const userId = authData.user.id;

        // Obtener balance
        const { data, error } = await supabase
            .from("userprofiles")
            .select("balance")
            .eq("id", userId)
            .single();

        if (error) {
            await log("Error obteniendo balance del usuario", error);
            return null;
        }

        return data;
    } catch (err) {
        // Captura cualquier otro error inesperado
        console.error("Unexpected error", err);
        return null;
    }
}



async function createNewUserProfile(id: string, name: string, lastName: string) {
    const { data, error } = await supabase.from("userprofiles").insert([{ id, name, lastName, balance: 0 }]);

    if (error) {
        await log("Error al crear el perfil de usuario", error);
        return error;
    }
    return data;
}

async function getUser() {

    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
        return user;
    }

    return null;
}

async function getLoggedUser() {
    const { data, error: AuthError } = await supabase.auth.getSession();

    if (AuthError) {
        await log("Error al obtener la sesión", AuthError);
        return null;
    }

    return data.session;
}


async function getLoggedUserName() {
    const data = await getLoggedUser();
    if (!data) {
        return null;
    }

    const { data: userprofiles, error } = await supabase
        .from('userprofiles')
        .select('name, lastName')
        .eq('id', data.user.id);

    if (error) {
        await log("Error al obtener el nombre del usuario", error);
        return;
    }

    if (userprofiles) {
        return userprofiles[0].name + " " + userprofiles[0].lastName;
    }
}

async function logout() {

    const { error } = await supabase.auth.signOut();

    if (error) {
        await log("Error al cerrar sesión", error);
        return error;
    }

}

async function updatePassword(newPassword: string) {
    const supabase = createClient();

    const { data, error } = await supabase.auth.updateUser({
        password: newPassword
    });

    if (error) throw error;
    return data;
}

async function recoverPassword(email: string) {
    const redirectURL = process.env.NEXT_PUBLIC_SUPABASE_REDIRECT_URL;

    if (!redirectURL) {
        throw new Error("URL no definida ");
    }

    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectURL
    });

    if (error) {
        await log("Error al enviar correo de recuperación de contraseña", error);
        throw error;
    }
    return data;
}

export { getBalanceForLoggedUser, getUser, getLoggedUser, getLoggedUserName, logout, createNewUserProfile, updatePassword, recoverPassword };
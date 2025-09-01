import { supabase } from "./ClientServiceSupabase";

async function getBalanceForLoggedUser() {
    const id = await supabase.auth.getUser().then((response) => {
        return response.data.user?.id;
    }).catch((error) => {
        console.error("Error", error);
        return null;
    });

    if (!id) {
        return;
    }

    const { data, error } = await supabase.from("userprofiles").select("balance").eq("id", id).single();

    if (error) {

        return error;
    }

    return data;
}

async function createNewUserProfile(id: string, name: string, lastName: string) {
    const { data, error } = await supabase.from("userprofiles").insert([{ id, name, lastName, balance: 0 }]);

    if (error) {
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
        console.error(error);
        return;
    }

    if (userprofiles) {
        return userprofiles[0].name + " " + userprofiles[0].lastName;
    }
}

async function logout() {

    const { error } = await supabase.auth.signOut();

    if (error) {
        console.error("Error", error);
        return error;
    }

}


export { getBalanceForLoggedUser, getUser, getLoggedUser, getLoggedUserName, logout, createNewUserProfile };
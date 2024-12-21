import { supabase } from "./SupabaseClientService";

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

    console.log(id);
    const { data, error } = await supabase.from("userprofiles").select("balance").eq("id", id).single();

    if (error) {
        console.error("Error", error);
        if (error.code === 'PGRST116') {
            await createNewUserProfile(id);
            return getBalanceForLoggedUser();
        }
        return error;
    }

    return data;
}

async function createNewUserProfile(id: string) {
    const { data, error } = await supabase.from("userprofiles").insert([{ id, balance: 0 }]);

    if (error) {
        console.error("Error al crear", error);
        return error;
    }
    return data;
}

async function getUserInfo(){}

export { getBalanceForLoggedUser, getUserInfo };
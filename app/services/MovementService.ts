import { supabase } from "./SupabaseClientService";

async function getMovementsForLoggedUser() {
    const id = await supabase.auth.getUser().then((response) => {
        return response.data.user?.id;
    }).catch((error) => {
        console.error("Error", error);
        return null;
    });

    if (!id) {
        return;
    }

    const { data, error } = await supabase.from("Movements").select("id, date, quantity, TypeMovement(type)").eq("iduser", id).gte("date", new Date(new Date().setMonth(new Date().getMonth() - 4)).toISOString());

    if (error) {
        console.error("Error", error);
        return error;
    }

    return data;
}

export { getMovementsForLoggedUser };
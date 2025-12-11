import { supabase } from "./ClientServiceSupabase";
import { TypeMovements } from "../constants/TypeMovements.types";
import { log } from "@/app/custom/EventLog";

async function getLastMovementsForUser() {
    const id = await supabase.auth.getUser().then((response) => {
        return response.data.user?.id;
    }).catch(async (error) => {
        await log("Error al obtener el usuario", error);
        return null;
    });

    if (!id) {
        return;
    }

    const { data, error } = await supabase.from("Movements")
        .select("id, date, quantity, TypeMovement(type)")
        .eq("iduser", id)
        .order("date", { ascending: false })
        .limit(5);

    if (error) {
        await log("Error al obtener movimientos", error);
        return error;
    }

    return data;
}

async function getMovementsForLoggedUser() {
    const id = await supabase.auth.getUser().then((response) => {
        return response.data.user?.id;
    }).catch(async (error) => {
        await log("Error al obtener el usuario", error);
        return null;
    }
    );
    if (!id) {
        return;
    }
    const { data, error } = await supabase.from("Movements")
        .select("id, date, quantity, TypeMovement(type)")
        .eq("iduser", id)
        .order("date", { ascending: false });
    if (error) {
        await log("Error al obtener movimientos", error);
        return error;
    }
    return data;
}

async function addMovementForUser(typeMovent: TypeMovements, quantity: number, date: Date) {
    const id = await supabase.auth.getUser().then((response) => {
        return response.data.user?.id;
    }).catch(async (error) => {
        await log("Error al obtener el usuario", error);
        return null;
    });

    if (!id) {
        return;
    }

    const { data: typeData, error: typeError } = await supabase
        .from("TypeMovement")
        .select("id")
        .eq("type", typeMovent)
        .single();

    if (typeError || !typeData) {
        return typeError;
    }

    const formattedDate = date.toLocaleDateString("en-CA");
    
    const { data, error } = await supabase.from("Movements").insert([{
        iduser: id,
        date: formattedDate,
        quantity: quantity < 0 ? quantity * -1 : quantity,
        idtype: typeData.id
    }]).select();

    if (error) {
        await log("Error insertando movimiento", error);
        return error;
    }

    return data;

}
export { getLastMovementsForUser, addMovementForUser, getMovementsForLoggedUser };
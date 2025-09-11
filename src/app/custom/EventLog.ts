
import { supabase } from "../services/ClientServiceSupabase";

// Guarda logs en la tabla 'logs' de Supabase
export async function log(message: string, error?: Error) {
    const now = new Date();
    const timestamp = now.toISOString().replace("T", " ").split(".")[0];
    const logMessage = `[${timestamp}] ${message}${error ? `\n${error.stack || error.message}` : ""}`;

    // Guarda el log en la tabla 'logs'
    await supabase.from("logs").insert([
        {
            created_at: now.toISOString(),
            error: error ? error.stack || error.message : null,
            message: logMessage
        }
    ]);

    // También muestra en consola para desarrollo
    if (process.env.NODE_ENV === "development") {
        console.error(logMessage);
    }
}
//Codigos de error de la API de autenticación https://supabase.com/docs/guides/auth/debugging/error-codes#auth-error-codes-table
export enum ErrorApiCodes {
    email_address_invalid = "El email es inválido",
    email_address_not_authorized = "El email no está autorizado",
    email_exists = "El email ya existe",
    email_not_confirmed = "El email no ha sido confirmado",
    email_provider_disabled = "El proveedor de email está deshabilitado",
    invalid_credentials = "Credenciales inválidas",
    user_not_found = "Usuario no encontrado",
    user_already_exists = "El usuario ya existe",
    user_banned = "Usuario baneado",
    weak_password = "Contraseña débil",
    phone_exists = "El teléfono ya existe",

}
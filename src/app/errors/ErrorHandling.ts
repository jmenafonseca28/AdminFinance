import { ErrorApiCodes } from "./ErrorApiCodes.enum";

export function getErrorMessage(code: string): string {
    return ErrorApiCodes[code as keyof typeof ErrorApiCodes] || "Error desconocido";
}







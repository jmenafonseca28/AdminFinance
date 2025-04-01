import { ChangeEvent } from "react";

export interface InputLabelProps {
    inputId: string;
    inputPlaceHolder: string;
    textLabel: string;
    typeInput?: string;
    onchange?: (event: ChangeEvent<HTMLInputElement>) => void;
}
import { ChangeEvent } from "react";

export interface InputLabelProps extends React.HTMLProps<HTMLInputElement> {
    inputId: string;
    inputPlaceHolder: string;
    textLabel: string;
    typeInput?: string;
    onchange?: (event: ChangeEvent<HTMLInputElement>) => void;
}
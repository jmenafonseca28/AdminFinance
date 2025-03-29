import React, { ChangeEvent } from 'react'

interface InputLabelProps {
    inputId: string;
    inputPlaceHolder: string;
    textLabel: string;
    typeInput?: string;
    onchange?: (event: ChangeEvent<HTMLInputElement>) => void;
}

export default function InputLabel({
    inputId,
    inputPlaceHolder,
    textLabel,
    typeInput = "text",
    onchange,
}: InputLabelProps) {
    return (
        <div className="form-floating mb-3">
            <input
                type={typeInput}
                className="form-control"
                id={inputId}
                placeholder={inputPlaceHolder}
                onChange={onchange}
            />
            <label htmlFor={inputId}>{textLabel}</label>
        </div>
    )
}

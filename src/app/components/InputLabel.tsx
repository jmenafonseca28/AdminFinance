import React from 'react'
import { InputLabelProps } from '../models/ComponentProps/InputLabelProps'

export default function InputLabel({
    inputId,
    inputPlaceHolder,
    textLabel,
    typeInput = "text",
    onchange,
    ...props
}: InputLabelProps) {
    return (
        <div className="mb-4">
            <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
                {textLabel}
            </label>
            <input
                type={typeInput}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:text-white"
                id={inputId}
                placeholder={inputPlaceHolder}
                onChange={onchange}
                {...props}
            />
        </div>
    )
}

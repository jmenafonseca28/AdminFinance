import { ChevronDown, ChevronUp } from 'lucide-react';
import React, { useState } from 'react'
import { DropDownButtonProps } from '../models/ComponentProps/DropDownButtonProps';

export default function DropDownButton({ text, body, onClick, ...props }: DropDownButtonProps) {

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    return (
        <div className="flex items-center"
            onMouseEnter={() => setIsDropdownOpen(true)}
            onMouseLeave={() => setIsDropdownOpen(false)}
            {...props}>
            <div className="relative">
                <button
                    onClick={() => {
                        setIsDropdownOpen(!isDropdownOpen);
                        onClick?.();
                    }}
                    className="flex items-center space-x-2 px-4 py-2 dark:text-white text-gray-700 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                    <span>{text}</span>
                    {isDropdownOpen ? <ChevronUp /> : <ChevronDown />}
                </button>

                {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50 text-gray-900 dark:text-white">
                        {body}
                    </div>
                )}
            </div>
        </div>
    )
}
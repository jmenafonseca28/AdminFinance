import React, { useEffect, useRef } from 'react'
import ModalProps from '../models/ComponentProps/ModalProps'
import { X } from 'lucide-react'

export default function Modal(props: ModalProps) {
    const dialogRef = props.ref ?? useRef<HTMLDialogElement>(null);

    // TODO: Animar el modal

    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) { return; }

        dialog.addEventListener('close', () => {
            props.onClickSecondaryButton?.();
        });

        return () => {
            if (dialog) {
                dialog.removeEventListener('close', () => { });
            }
        };
    }, [props.onClickSecondaryButton]);

    function handleClickPrimaryButton() {
        props.onClickPrimaryButton?.();
        dialogRef.current?.close();
    }

    return (
        <dialog
            ref={dialogRef}
            id={props.idModal}
            className="backdrop:bg-black/50 backdrop:backdrop-blur-sm rounded-lg p-0 shadow-xl fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96"
        >
            <div className="w-full max-w-md">
                <div className="bg-white dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center justify-between p-4 border-b">
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">{props.title}</h2>
                        <button
                            onClick={() => dialogRef.current?.close()}
                            className="text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400">
                            <X size={24} />
                        </button>
                    </div>
                    <div className="p-4">
                        {props.body}
                    </div>
                    <div className="flex justify-end gap-2 p-4 border-t">
                        {props.textSecondaryButton && (
                            <button
                                onClick={() => dialogRef.current?.close()}
                                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                            >
                                {props.textSecondaryButton}
                            </button>
                        )}
                        <button
                            onClick={handleClickPrimaryButton}
                            className="px-4 py-2 text-white bg-blue-600 dark:bg-blue-500 rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
                        >
                            {props.textPrimaryButton}
                        </button>
                    </div>
                </div>
            </div>
        </dialog>
    )
}
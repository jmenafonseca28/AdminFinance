import React, { useEffect, useRef } from 'react'
import ModalProps from '../models/ComponentProps/ModalProps'
import { X } from 'lucide-react'

export default function Modal({
    title,
    body,
    textPrimaryButton,
    idModal,
    ref: propsRef,
    onClickPrimaryButton,
    textSecondaryButton,
    onClickSecondaryButton
}: ModalProps) {

    const dialogRef = propsRef ?? useRef<HTMLDialogElement>(null);

    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) { return; }

        const handleClose = () => {
            dialog.classList.remove('animate-fade-out');
            dialog.classList.add('animate-fade-in');
        };

        dialog.addEventListener('close', handleClose);

        return () => {
            dialog.removeEventListener('close', handleClose);
        };
    }, [onClickSecondaryButton]);

    function handleClickPrimaryButton() {

        if (!dialogRef.current) return;

        dialogRef.current.classList.remove('animate-fade-in');
        dialogRef.current.classList.add('animate-fade-out');

        onClickPrimaryButton?.();
        setTimeout(() => {
            dialogRef.current?.close();
        }, 200);
    }

    function handleClickSecondaryButton() {

        if (!dialogRef.current) return;

        dialogRef.current.classList.remove('animate-fade-in');
        dialogRef.current.classList.add('animate-fade-out');

        onClickSecondaryButton?.();
        setTimeout(() => {
            dialogRef.current?.close();
        }, 200);
    }

    return (
        <dialog
            ref={dialogRef}
            id={idModal}
            className="border-0 outline-none backdrop:bg-black/50 backdrop:backdrop-blur-sm p-0 shadow-xl top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-95  rounded-lg bg-gray-800 animate-fade-in"
            style={{ animationDuration: '0.2s' }}
        >
            <div className="w-full max-w-md">
                <div className="bg-white dark:bg-gray-800">
                    <div className="flex items-center justify-between p-6">
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">{title}</h2>
                        <button
                            onClick={() => handleClickSecondaryButton()}
                            className="text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400">
                            <X size={24} />
                        </button>
                    </div>
                    <div className="p-4">
                        {body}
                    </div>
                    <div className="flex justify-end gap-2 p-4 ">
                        {textSecondaryButton && (
                            <button
                                onClick={() => handleClickSecondaryButton()}
                                className="border dark:border-0 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                            >
                                {textSecondaryButton}
                            </button>
                        )}
                        <button
                            onClick={handleClickPrimaryButton}
                            className="px-4 py-2 text-white bg-blue-600 dark:bg-blue-500 rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
                        >
                            {textPrimaryButton}
                        </button>
                    </div>
                </div>
            </div>
        </dialog>

    )
}
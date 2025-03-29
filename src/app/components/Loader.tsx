'use client'
import React, { useRef, useEffect } from 'react'
import { EventsNames } from '../constants/EventsNames';

type colors = `bg-${string}`;

interface LoaderProps {
    showId: string;
    text?: string;
    color?: colors;
    callback?: () => void;
};

/**
 * Loader component that shows a loading spinner when the loader event is triggered.
 * @param {LoaderProps} props - The props for the Loader component.
 * @param {() => void} props.callback - Optional callback function to be called when the loader event is triggered.
 * @returns {React.JSX.Element} The Loader component.
 */
export default function Loader({ showId, text, color = 'bg-gray-300', callback }: LoaderProps): React.JSX.Element {

    const loader = useRef<HTMLDivElement>(null);
    const loadersContent = useRef<HTMLDivElement>(null);
    const loaders = useRef<HTMLCollection>(null);
    const isSpinning = useRef(false);

    useEffect(() => {

        loaders.current = loadersContent.current?.children ?? null;

        document.addEventListener(EventsNames.LOADER, handleLoaderEvent);

        document.addEventListener(EventsNames.QUIT_LOADER, handleQuitLoaderEvent);

        return () => {
            isSpinning.current = false;
            document.removeEventListener(EventsNames.LOADER, handleLoaderEvent);
            document.removeEventListener(EventsNames.QUIT_LOADER, handleQuitLoaderEvent);
        };
    }, [showId, callback]);


    const handleLoaderEvent = (e: Event) => {

        isSpinning.current = true;

        handleChangeColor(handleValidateColors());

        const { detail } = e as CustomEvent;
        if (detail && detail.id === showId) {
            loader.current?.classList.remove('hidden');
            loader.current?.classList.add('flex');
        } else {
            loader.current?.classList.remove('flex');
            loader.current?.classList.add('hidden');

            isSpinning.current = false;
        }
        callback?.();
    };

    const handleQuitLoaderEvent = () => {
        isSpinning.current = false;
        loader.current?.classList.remove('flex');
        loader.current?.classList.add('hidden');
    }

    const handleValidateColors = () => {
        const auxColors = ['bg-gray-100', 'bg-gray-800'];

        if (auxColors.includes(color)) {
            const oldColors = Array.from(auxColors);
            auxColors[auxColors.indexOf(color)] = `${auxColors[auxColors.indexOf(color)].split("-").slice(0, 2).join("-")}-${Number(auxColors[auxColors.indexOf(color)].split("-")[2]) + 100}`;
            if (loaders.current) {
                const array = Array.from(loaders.current);
                array.forEach((element) => {
                    if (element.classList.contains(color)) return;
                    element.classList.remove(...oldColors.map((e) => { return `dark:${e}` }), ...oldColors);
                    element.classList.add(`dark:${auxColors[1]}`, auxColors[0]);
                });
            }
        }

        return auxColors;
    }

    const handleChangeColor = async (auxColors: Array<string>) => {

        while (isSpinning.current) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            if (loaders.current) {
                const array = Array.from(loaders.current);
                const index = array.findIndex((element) => element.classList.contains(color));
                const nextIndex = (index + 1) % array.length;

                array[index].classList.remove(color);
                array[index].classList.add(`dark:${auxColors[1]}`, auxColors[0]);
                array[nextIndex].classList.add(color);
                array[nextIndex].classList.remove(`dark:${auxColors[1]}`, auxColors[0]);
            }
        }
    }

    return (
        <div
            className={`hidden fixed inset-0 bg-gray-600/30 z-50 animate-fade-in animate-duration-200`}
            ref={loader}
        >
            <div className="flex flex-col justify-center items-center h-full w-full">
                <div className={`flex gap-2 h-40 w-72 justify-center items-center shadow-2x bg-white dark:bg-gray-400 ${text !== undefined ? 'rounded-t-3xl' : 'rounded-3xl'}`} ref={loadersContent}>
                    <div className={`animate-bounce-50 h-5 w-5 ${color} rounded-full border border-gray-500 dark:border-gray-400`}></div>
                    <div className="animate-bounce-100 h-5 w-5 bg-gray-100 dark:bg-gray-800 rounded-full border border-gray-500 dark:border-gray-400"></div>
                    <div className="animate-bounce-200 h-5 w-5 bg-gray-100 dark:bg-gray-800 rounded-full border border-gray-500 dark:border-gray-400"></div>
                    <div className="animate-bounce-300 h-5 w-5 bg-gray-100 dark:bg-gray-800 rounded-full border border-gray-500 dark:border-gray-400"></div>
                </div>
                <div className={`${text ?? 'hidden'} bottom-0 left-0 right-0 flex justify-center items-center h-10 w-72 bg-white dark:bg-gray-400 rounded-b-3xl shadow-2xl`}>
                    <p className="text-sm font-semibold text-gray-800">{text}</p>
                </div>
            </div>
        </div>
    );
}
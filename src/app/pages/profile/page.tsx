'use client'
import React, { useEffect, useState } from 'react'
import User from '@/app/models/User.model';

export default function Profile() {
    //States
    const [user, setUser] = useState({} as User);

    //Effect
    useEffect(() => {

    },[]);

    //Functions

    return (
        <div className='flex flex-col items-center justify-center h-screen dark:bg-gray-900 bg-gray-100 dark:text-white text-gray-900'>
            <h1 className='text-4xl font-bold mb-4'>Perfil</h1>


            <div className='bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 w-96 gap-5 flex flex-col'>
                <h2 className='text-2xl font-semibold mb-4'>Información del usuario</h2>
                <p className='text-gray-700 dark:text-gray-300'>Nombre:</p>
                <p className='text-gray-700 dark:text-gray-300'>Apellido:</p>
                <p className='text-gray-700 dark:text-gray-300'>Email:</p>
                <p className='text-gray-700 dark:text-gray-300'>Tiempo desde la creación del perfil:</p>
                <p className='text-gray-700 dark:text-gray-300'>Último acceso:</p>
                <p className='text-gray-700 dark:text-gray-300'>Movimientos totales:</p>
                <p className='text-gray-700 dark:text-gray-300'>Gastos totales:</p>
                <p className='text-gray-700 dark:text-gray-300'>Ingresos totales:</p>
                <p className='text-gray-700 dark:text-gray-300'>Balance total:</p>
            </div>
            <div className='mt-6'>
                <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>
                    Editar perfil
                </button>
            </div>

        </div>
    )
}
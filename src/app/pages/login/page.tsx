'use client';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import InputLabel from '../../components/InputLabel';
import UserLogin from '@/app/models/UserLogin.model';
import { login } from '@/app/services/AuthService';
import Loader from '@/app/components/Loader';
import { LoaderEvent } from '@/app/custom/LoaderEvent';
import toast, { Toaster } from 'react-hot-toast';
import { AuthError } from '@supabase/supabase-js';
export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const loaderEvent = LoaderEvent('loginLoader');
        document.dispatchEvent(loaderEvent);
        const loaderEventQuit = LoaderEvent('loginLoader', true);

        const user: UserLogin = {
            email,
            password
        };

        try {
            await toast.promise(
                login(user),
                {
                    loading: 'Iniciando sesión...',
                    success: <b>Éxitoso!</b>,
                    error: <b>No se pudo iniciar sesión</b>,
                },
            );

            document.dispatchEvent(loaderEventQuit);
            router.push('/pages/home');
        } catch (error: AuthError | any) {
            document.dispatchEvent(loaderEventQuit);
            toast.error(error.message ?? 'Hubo un error al iniciar sesión, pruebe más tarde');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-700">
            <div className="bg-white dark:bg-gray-600 shadow-lg rounded-lg max-w-sm w-full">
                <div className="p-6 text-black dark:text-white">
                    <h1 className="text-2xl font-bold text-center mb-6">
                        Bienvenido
                    </h1>
                    <form onSubmit={handleSubmit}>
                        <InputLabel
                            inputId="email"
                            inputPlaceHolder="Correo electrónico"
                            textLabel="Correo electrónico"
                            typeInput="email"
                            onchange={(e) => setEmail(e.target.value)}
                        />
                        <InputLabel
                            inputId="password"
                            inputPlaceHolder="Contraseña"
                            textLabel="Contraseña"
                            typeInput="password"
                            onchange={(e) => setPassword(e.target.value)}
                        />
                        <button
                            type="submit"
                            className="bg-blue-500 text-white w-full py-2 rounded hover:bg-blue-600 transition"
                        >
                            Entrar
                        </button>
                    </form>
                    <p className="text-center mt-4">
                        ¿No tienes una cuenta?{' '}
                        <a
                            href="/pages/register"
                            className="text-blue-500 hover:underline"
                        >
                            Regístrate aquí
                        </a>
                    </p>
                </div>
            </div>
            <Loader showId='loginLoader' text='Iniciando sesión' />
            <Toaster />
        </div>
    );
}


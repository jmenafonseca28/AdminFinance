'use client'
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import InputLabel from '../../components/InputLabel'
import UserLogin from '@/app/models/UserLogin.model'
import { login } from '@/app/services/AuthService'

export default function Login() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const user: UserLogin = {
            email,
            password
        }

        try {
            const response = await login(user)
            if (response) {
                router.push('/pages/home')
            }
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-light">
            <div className="card shadow-lg" style={{ maxWidth: '400px' }}>
                <div className="card-body p-4 p-md-5">
                    <h1 className="card-title text-center mb-4 fw-bold">
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
                            className="btn btn-primary w-100 py-2"
                        >
                            Entrar
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}


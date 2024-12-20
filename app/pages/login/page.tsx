'use client'

import React, { useState } from 'react'
import InputLabel from '../../components/InputLabel'
import UserLogin from '@/app/models/UserLogin.model'
import { login } from '@/app/services/AuthService'

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const submit = async () => {
        const user: UserLogin = {
            email,
            password
        };
        console.log("submit");
        try {
            await login(user);
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div
            className="container d-flex justify-content-center align-items-center min-vh-100"
        >
            <div className="card shadow">
                <div className="card-body">
                    <h2 className="card-title text-center mb-4">Bienvenido</h2>
                    <div>
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
                        <button className="btn btn-primary w-100 mt-3" onClick={submit} >
                            Entrar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

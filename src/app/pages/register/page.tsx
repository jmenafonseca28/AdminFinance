"use client"

import { useRouter } from "next/navigation";
import type React from "react";
import { useState } from "react";
import InputLabel from "../../components/InputLabel";
import { register } from "@/app/services/AuthService";
import Loader from "@/app/components/Loader";
import { LoaderEvent } from "@/app/custom/LoaderEvent";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";
import { AuthError, isAuthApiError } from "@supabase/supabase-js";


export default function Register() {
  const [name, setName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      toast.error("Las contraseñas no coinciden")
      return
    }

    if (password.length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres")
      return
    }

    const loaderEvent = LoaderEvent("registerLoader")
    document.dispatchEvent(loaderEvent)
    const loaderEventQuit = LoaderEvent("registerLoader", true)

    const user = {
      name,
      lastName,
      email,
      password,
    }

    try {
      await toast.promise(register(user), {
        loading: "Creando cuenta...",
        success: <b>¡Cuenta creada exitosamente!</b>,
        error: <b>No se pudo crear la cuenta</b>,
      })
      
      document.dispatchEvent(loaderEventQuit)
      router.push("/pages/login")
    } catch (error: AuthError | any) {
      if (isAuthApiError(error)) {
        toast.error(`Error: ${error.message} (Código: ${error.code})`)
      }
      document.dispatchEvent(loaderEventQuit)
      toast.error(error.message ?? "Hubo un error al crear la cuenta, pruebe más tarde")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-700">
      <div className="bg-white dark:bg-gray-600 shadow-lg rounded-lg max-w-sm w-full">
        <div className="p-6 text-black dark:text-white">
          <h1 className="text-2xl font-bold text-center mb-6">Crear Cuenta</h1>
          <form onSubmit={handleSubmit}>
            <InputLabel
              inputId="name"
              inputPlaceHolder="Nombre "
              textLabel="Nombre "
              typeInput="text"
              onchange={(e) => setName(e.target.value)}
            />
            <InputLabel
              inputId="lastName"
              inputPlaceHolder="Apellido"
              textLabel="Apellido"
              typeInput="text"
              onchange={(e) => setLastName(e.target.value)}
            />
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
            <InputLabel
              inputId="confirmPassword"
              inputPlaceHolder="Confirmar contraseña"
              textLabel="Confirmar contraseña"
              typeInput="password"
              onchange={(e) => setConfirmPassword(e.target.value)}
            />
            <button
              type="submit"
              className="bg-green-500 text-white w-full py-2 rounded hover:bg-green-600 transition mb-4"
            >
              Registrarse
            </button>
          </form>
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              ¿Ya tienes una cuenta?{" "}
              <Link
                href="/pages/login"
                className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
              >
                Inicia sesión
              </Link>
            </p>
          </div>
        </div>
      </div>
      <Loader showId="registerLoader" text="Creando cuenta..." />
      <Toaster />
    </div>
  )
}

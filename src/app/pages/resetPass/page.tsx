"use client"

import type React from "react"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { updatePassword } from "@/app/services/UserProfilesService"
import { Lock, ArrowLeft, Eye, EyeOff, CheckCircle } from "lucide-react"
import toast, { Toaster } from "react-hot-toast"

export default function ResetPassword() {
  const router = useRouter()
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const validatePasswords = () => {
    if (!newPassword || !confirmPassword) {
      toast.error("Por favor completa todos los campos")
      return false
    }
    if (newPassword.length < 8) {
      toast.error("La contraseña debe tener al menos 8 caracteres")
      return false
    }
    if (newPassword !== confirmPassword) {
      toast.error("Las contraseñas no coinciden")
      return false
    }
    return true
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validatePasswords()) return

    setIsLoading(true)
    try {
      await toast.promise(updatePassword(newPassword), {
        loading: "Actualizando contraseña...",
        success: <b>¡Contraseña actualizada exitosamente!</b>,
        error: <b>Error al actualizar la contraseña</b>,
      })
      setNewPassword("")
      setConfirmPassword("")
      setTimeout(() => router.push("/pages/profile"), 1500)
    } catch (error: any) {
      console.error("Error:", error)
      toast.error(error.message ?? "Hubo un error al cambiar la contraseña")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-700 dark:bg-gray-700 text-white">
      <div className="max-w-md mx-auto px-4 py-16 sm:px-6 lg:px-8">

        <div className="mb-8">
          <button
            onClick={() => router.push("/pages/profile")}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-600 rounded-lg transition-colors mb-6"
            aria-label="Volver atrás"
          >
            <ArrowLeft size={18} />
            Volver
          </button>
          <h1 className="text-3xl font-bold">Cambiar Contraseña</h1>
          <p className="text-gray-400 mt-2">Actualiza tu contraseña de forma segura</p>
        </div>


        <div className="bg-gray-800 dark:bg-gray-800 rounded-lg p-8 shadow-lg border border-gray-700">
          <form onSubmit={handleChangePassword} className="space-y-6">

            <div>
              <label htmlFor="newPassword" className="block text-sm font-semibold text-gray-300 mb-2">
                Nueva Contraseña
              </label>
              <div className="relative">
                <input
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Ingresa tu nueva contraseña"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition"
                  aria-label={showNewPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-1">Mínimo 8 caracteres</p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-300 mb-2">
                Confirmar Contraseña
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirma tu nueva contraseña"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition"
                  aria-label={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {newPassword && (
              <div className="bg-gray-700 rounded-lg p-3 flex items-center gap-2">
                <CheckCircle size={18} className="text-green-400" />
                <span className="text-sm text-gray-300">
                  {newPassword.length >= 8 ? "Contraseña fuerte" : "Contraseña débil"}
                </span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors shadow-lg flex items-center justify-center gap-2"
            >
              <Lock size={18} />
              {isLoading ? "Actualizando..." : "Actualizar Contraseña"}
            </button>
          </form>
        </div>

        <div className="mt-6 p-4 bg-gray-800 rounded-lg border border-gray-700">
          <p className="text-xs text-gray-400">
            <span className="font-semibold text-gray-300">Consejo:</span> Usa una contraseña única y segura. No la
            compartas con nadie.
          </p>
        </div>
      </div>

      <Toaster />
    </div>
  )
}

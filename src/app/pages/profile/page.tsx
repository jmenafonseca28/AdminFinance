'use client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { getBalanceForLoggedUser, getLoggedUserName, getUser, recoverPassword } from '@/app/services/UserProfilesService'
import { getMovementsForLoggedUser } from '@/app/services/MovementService'
import { User, Mail, Wallet, ArrowLeft, TrendingUp, TrendingDown } from 'lucide-react'
import { Lock } from 'lucide-react'
import Navbar from '@/app/components/Navbar'

import Movements from '@/app/models/Movements.model'
import { TypeMovements } from '@/app/constants/TypeMovements.types'
import { formatDateString } from '@/app/scripts/DateParser'

export default function Profile() {
    const router = useRouter()
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [balance, setBalance] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [showPasswordDialog, setShowPasswordDialog] = useState(false)
    const [isRecovering, setIsRecovering] = useState(false)

    //todos los movimientos del usuario
    const [movements, setMovements] = useState<Movements[]>([]);
    
    function backToHome() {
        router.push('/pages/home');
    };

  

    async function handleRecoverPassword() {
        setIsRecovering(true)
        try {
            const result = await recoverPassword(email)
            if (result) {
                alert("Se ha enviado un correo de recuperación de contraseña a tu email")
            }
        } catch (err) {
            console.error("Error al enviar correo de recuperación:", err)
            alert("Error al enviar el correo de recuperación")
        } finally {
            setIsRecovering(false)
            setShowPasswordDialog(false)
        }
    }
    
    useEffect(() => {
        async function loadProfileData() {
            try {
                const user = await getUser();
                if (user?.email) setEmail(user.email);
                const name = await getLoggedUserName();
                if (name) setFullName(name);
                const balanceData = await getBalanceForLoggedUser();
                if (balanceData) setBalance(balanceData.balance);
                
                // Cargar movimientos
                const movementsData = await getMovementsForLoggedUser();
                if (movementsData && !("code" in movementsData)) {
                    const mapped = movementsData.map((m: any) => ({
                        id: m.id,
                        date: m.date,
                        quantity: m.quantity,
                        TypeMovement: { type: m.TypeMovement?.type || m.type || "" }
                    }));
                    setMovements(mapped);
                }
            } catch (err) {
                console.error("Error loading profile data:", err);
            }
            setLoading(false);
        }
        loadProfileData();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-700 dark:bg-gray-700 flex items-center justify-center">
                <div className="text-gray-300 text-lg">Cargando perfil...</div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-700 dark:bg-gray-700 text-white">
                <Navbar />
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white">Mi Perfil</h1>
                    <p className="text-gray-400 mt-2">Información de tu cuenta</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

                    <div className="bg-gray-800 dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-gray-400 mb-2 font-semibold">Nombre Completo</p>
                                <p className="text-xl font-bold text-white">{fullName || "—"}</p>
                            </div>
                            <User size={28} className="text-blue-400" />
                        </div>
                    </div>

                    <div className="bg-gray-800 dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-gray-400 mb-2 font-semibold">Correo Electrónico</p>
                                <p className="text font-semibold text-white break-all">{email || "—"}</p>
                            </div>
                            <Mail size={28} className="text-purple-400" />
                        </div>
                    </div>

                    <div className="bg-gray-800 dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-gray-400 mb-2 font-semibold">Balance Total</p>
                                <p className="text-2xl font-bold text-green-400">₡{balance !== null ? balance.toLocaleString('es-CR') : "0"}</p>
                            </div>
                            <Wallet size={28} className="text-green-400" />
                        </div>
                    </div>
                </div>

                <div className="flex gap-4">
                    <button
                        onClick={backToHome}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors shadow-lg"
                    >
                        <ArrowLeft size={18} />
                        Volver a la página de inicio
                    </button>

                    <button
                        onClick={() => setShowPasswordDialog(true)}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg transition-colors shadow-lg"
                    >
                        <Lock size={18} />
                        Cambiar Contraseña
                    </button>
                </div>

                {showPasswordDialog && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full border border-gray-700 shadow-xl">
                            <h2 className="text-xl font-bold text-white mb-4">Cambiar Contraseña</h2>
                            <p className="text-gray-300 mb-6">
                                Se enviará un correo de recuperación a <span className="font-semibold">{email}</span> para que puedas
                                cambiar tu contraseña.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowPasswordDialog(false)}
                                    className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors"
                                    disabled={isRecovering}
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleRecoverPassword}
                                    disabled={isRecovering}
                                    className="flex-1 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isRecovering ? "Enviando..." : "Enviar"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* --- TABLA DE TODAS LAS TRANSACCIONES --- */}
                <div className="mt-8 bg-gray-800 dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-700">
                    <h5 className="text-lg font-semibold mb-4 text-white">Historial de Transacciones</h5>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-700">
                                    <th className="text-left py-3 px-4 text-gray-300">Fecha</th>
                                    <th className="text-left py-3 px-4 text-gray-300">Tipo</th>
                                    <th className="text-right py-3 px-4 text-gray-300">Cantidad</th>
                                </tr>
                            </thead>

                            <tbody>
                                {movements.length > 0 ? (
                                    movements.map(movement => (
                                        <tr key={movement.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                                            <td className="py-3 px-4 text-gray-200">{formatDateString(movement.date)}</td>

                                            <td className="py-3 px-4">
                                                <div className="flex items-center gap-2">
                                                    {movement.TypeMovement.type === TypeMovements.ENTRANCE ? (
                                                        <>
                                                            <TrendingUp size={16} className="text-green-500" />
                                                            <span className="text-green-500 font-medium">Ingreso</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <TrendingDown size={16} className="text-red-500" />
                                                            <span className="text-red-500 font-medium">Gasto</span>
                                                        </>
                                                    )}
                                                </div>
                                            </td>

                                            <td className="py-3 px-4 text-right">
                                                <span
                                                    className={
                                                        movement.TypeMovement.type === TypeMovements.ENTRANCE
                                                            ? "text-green-500 font-semibold"
                                                            : "text-red-500 font-semibold"
                                                    }
                                                >
                                                    {movement.TypeMovement.type === TypeMovements.ENTRANCE ? "+" : "-"}₡
                                                    {movement.quantity.toFixed(2)}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td className="py-8 px-4 text-center text-gray-400" colSpan={3}>
                                            No hay transacciones registradas
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}
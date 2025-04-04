'use client'
import React, { useState, useEffect, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { PlusCircle, MinusCircle, Wallet, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import MonthReport from '@/app/models/MonthReport.model';
import { getMovementsForLoggedUser } from '@/app/services/MovementService';
import Movements from '@/app/models/Movements.model';
import { Months } from '@/app/constants/Months.types';
import { getBalanceForLoggedUser } from '@/app/services/UserProfilesService';
import { TypeMovements } from '@/app/constants/TypeMovements.types';
import { parseDate } from '@/app/scripts/DateParser';
import Navbar from '@/app/components/Navbar';
import CustomModal from '@/app/components/CustomModal';
import InputLabel from '@/app/components/InputLabel';

const DashboardPage = () => {
    // State variables
    const [isMounted, setIsMounted] = useState(false);
    const [data, setData] = useState<MonthReport[]>([]);
    const [totalBalance, setTotalBalance] = useState(0);
    const [monthEntrance, setMonthEntrance] = useState(0);
    const [monthBill, setMonthBill] = useState(0);

    // Refs
    const addModalRef = useRef<HTMLDialogElement>(null);
    const substractModalRef = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        setIsMounted(true);
        modifyData();
    }, []);

    async function modifyData() {
        setData(await createData());
        await getBalance();
    }

    async function getBalance() {
        const balanceResult = await getBalanceForLoggedUser();
        if (balanceResult && 'balance' in balanceResult) {
            setTotalBalance(balanceResult.balance);
        }
    }

    async function createData(): Promise<MonthReport[]> {
        const movements = await getMovementsForLoggedUser() as Movements[] | undefined;
        if (!movements || 'code' in movements) {
            return [];
        }

        const data: MonthReport[] = [];

        movements.forEach((movement) => {
            const date = parseDate(movement.date);
            const month = Months[date.getMonth()];

            const report = data.find((item) => item.month === month);

            if (report) {
                if (movement.TypeMovement.type === TypeMovements.ENTRANCE) {
                    report.Ingresos += movement.quantity;
                } else {
                    report.Gastos += movement.quantity;
                }
            } else {
                data.push({
                    month,
                    Ingresos: movement.TypeMovement.type === TypeMovements.ENTRANCE ? movement.quantity : 0,
                    Gastos: movement.TypeMovement.type === TypeMovements.BILL ? movement.quantity : 0
                });
            }
        });

        calculateEntranceBill(data);

        return data;
    }

    function calculateEntranceBill(data: MonthReport[]) {
        const monthNow = new Date().getMonth();
        const monthNowData = data.find((item) => item.month === Months[monthNow]);

        if (monthNowData) {
            setMonthEntrance(monthNowData.Ingresos);
            setMonthBill(monthNowData.Gastos);
        }
    }

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Cards de resumen */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* Balance Total */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Balance Total</p>
                                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">₡{totalBalance}</h2>
                            </div>
                            <Wallet size={32} className="text-blue-600" />
                        </div>
                    </div>

                    {/* Ingresos del Mes */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Ingresos del Mes</p>
                                <h2 className="text-2xl font-semibold text-green-600">+₡{monthEntrance}</h2>
                            </div>
                            <ArrowUpRight size={32} className="text-green-600" />
                        </div>
                    </div>

                    {/* Gastos del Mes */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Gastos del Mes</p>
                                <h2 className="text-2xl font-semibold text-red-600">-₡{monthBill}</h2>
                            </div>
                            <ArrowDownRight size={32} className="text-red-600" />
                        </div>
                    </div>
                </div>

                {/* Gráfico */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
                    <h5 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Resumen Financiero</h5>
                    <div className="h-[400px]">
                        {isMounted && (
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart
                                    data={data}
                                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="Ingresos" stroke="#198754" strokeWidth={2} />
                                    <Line type="monotone" dataKey="Gastos" stroke="#dc3545" strokeWidth={2} />
                                </LineChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>

                {/* Botones de acción */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                        className="flex items-center justify-center gap-2 w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors"
                        onClick={() => { addModalRef.current?.showModal() }}
                    >
                        <PlusCircle size={20} />
                        Registrar Ingreso
                    </button>
                    <button
                        className="flex items-center justify-center gap-2 w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors"
                        onClick={() => { substractModalRef.current?.showModal() }}
                    >
                        <MinusCircle size={20} />
                        Registrar Gasto
                    </button>
                </div>
            </div>

            <CustomModal
                title='Agregar ingreso'
                idModal='addModal'
                textPrimaryButton='Agregar'
                textSecondaryButton='Cancelar'
                ref={addModalRef}
                body={
                    <InputLabel inputId='addInput' inputPlaceHolder='0' textLabel='Ingreso' min={0} max={100000} typeInput='number' />
                }
            />

            <CustomModal
                title='Agregar gasto'
                idModal='subtractionModal'
                textPrimaryButton='Agregar'
                textSecondaryButton='Cancelar'
                ref={substractModalRef}
                body={
                    <InputLabel inputId='addInput' inputPlaceHolder='0' textLabel='Gasto' min={0} max={100000} typeInput='number' />
                }
            />
        </div>
    );
};

export default DashboardPage;
'use client'
import React, { useState, useEffect } from 'react';
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


const DashboardPage = () => {
    const [isMounted, setIsMounted] = useState(false);
    const [data, setData] = useState<MonthReport[]>([]);
    const [totalBalance, setTotalBalance] = useState(0);
    const [monthEntrance, setMonthEntrance] = useState(0);
    const [monthBill, setMonthBill] = useState(0);

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

    function showAddModal() {
        // TODO: Implementar el modal de agregar ingreso
    }


    return (
        <div className="container-fluid">

            <Navbar />

            <div className="container">
                <div className="row mb-4">
                    <div className="col-md-4 mb-3 mb-md-0">
                        <div className="card">
                            <div className="card-body">
                                <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <p className="text-muted mb-1">Balance Total</p>
                                        <h2 className="h4 mb-0">₡{totalBalance}</h2>
                                    </div>
                                    <Wallet size={32} className="text-primary" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4 mb-3 mb-md-0">
                        <div className="card">
                            <div className="card-body">
                                <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <p className="text-muted mb-1 m-96">Ingresos del Mes</p>
                                        <h2 className="h4 mb-0 text-success">+₡{monthEntrance}</h2>
                                    </div>
                                    <ArrowUpRight size={32} className="text-success" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="card">
                            <div className="card-body">
                                <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <p className="text-muted mb-1">Gastos del Mes</p>
                                        <h2 className="h4 mb-0 text-danger">-₡{monthBill}</h2>
                                    </div>
                                    <ArrowDownRight size={32} className="text-danger" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card mb-4">
                    <div className="card-header">
                        <h5 className="card-title mb-0">Resumen Financiero</h5>
                    </div>
                    <div className="card-body">
                        <div style={{ width: '100%', height: '400px' }}>
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
                                        <Line
                                            type="monotone"
                                            dataKey="Ingresos"
                                            stroke="#198754"
                                            strokeWidth={2}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="Gastos"
                                            stroke="#dc3545"
                                            strokeWidth={2}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-6">
                        <button className="btn btn-success w-100 mb-3 d-flex align-items-center justify-content-center gap-2"
                            data-bs-toggle="modal" data-bs-target={`#${"addModal"}`} onClick={showAddModal}>
                            <PlusCircle />
                            Registrar Ingreso
                        </button>
                    </div>
                    <div className="col-md-6">
                        <button className="btn btn-danger w-100 mb-3 d-flex align-items-center justify-content-center gap-2">
                            <MinusCircle />
                            Registrar Gasto
                        </button>
                    </div>
                </div>
            </div>
            <CustomModal title='Agregar ingreso' idModal='addModal' textPrimaryButton='Agregar'
                textSecondaryButton='Cancelar'
                body={<>
                    <form>
                        <input type="number" className="form-control mb-3" placeholder="0" min={0} max={100000000} />
                    </form>
                </>} />
        </div>
    );
};

export default DashboardPage;
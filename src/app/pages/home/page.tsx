'use client'
import React, { useState, useEffect, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { PlusCircle, MinusCircle, Wallet, ArrowUpRight, ArrowDownRight, TrendingUp, TrendingDown } from 'lucide-react';
import MonthReport from '@/app/models/MonthReport.model';
import { addMovementForUser, getLastMovementsForUser } from '@/app/services/MovementService';
import Movements from '@/app/models/Movements.model';
import { Months } from '@/app/constants/Months.types';
import { getBalanceForLoggedUser } from '@/app/services/UserProfilesService';
import { TypeMovements } from '@/app/constants/TypeMovements.types';
import { formatDateString } from '@/app/scripts/DateParser';
import Navbar from '@/app/components/Navbar';
import CustomModal from '@/app/components/CustomModal';
import InputLabel from '@/app/components/InputLabel';
import toast, { Toaster } from 'react-hot-toast';



const DashboardPage = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [data, setData] = useState<MonthReport[]>([]);
  const [totalBalance, setTotalBalance] = useState(0);
  const [monthEntrance, setMonthEntrance] = useState(0);
  const [monthBill, setMonthBill] = useState(0);

  // Últimos movimientos
  const [movements, setMovements] = useState<Movements[]>([]);

  // Refs modales
  const addModalRef = useRef<HTMLDialogElement>(null);
  const substractModalRef = useRef<HTMLDialogElement>(null);
  const addInputRef = useRef<HTMLInputElement>(null);
  const subtractInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsMounted(true);
    modifyData();
  }, []);

  async function modifyData() {
    setData(await createData());
    await getBalance();

    const movementsData = await getLastMovementsForUser();
    if (movementsData && !("code" in movementsData)) {
      const mapped = movementsData.map((m: any) => ({
        id: m.id,
        date: m.date,
        quantity: m.quantity,
        TypeMovement: { type: m.TypeMovement?.type || m.type || "" }
      }));
      setMovements(mapped);
    }
  }

  async function getBalance() {
    const balanceResult = await getBalanceForLoggedUser();
    if (balanceResult && "balance" in balanceResult) {
      setTotalBalance(balanceResult.balance);
    }
  }

  function validNumberForMovement(value: string): boolean {
    const number = parseFloat(value.trim());
    if (isNaN(number) || number <= 0 || number >= 100000000) {
      toast.error("El número no es válido");
      return false;
    }
    return true;
  }

  async function createData(): Promise<MonthReport[]> {
    const movements = await getLastMovementsForUser() as Movements[] | undefined;
    if (!movements || "code" in movements) return [];

    const data: MonthReport[] = [];

    movements.forEach(movement => {
      const monthIndex = new Date(movement.date).getMonth();
      const month = Months[monthIndex];

      const report = data.find(item => item.month === month);

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


    data.sort((a, b) => Months.indexOf(a.month as any) - Months.indexOf(b.month as any));
    calculateEntranceBill(data);
    return data;
  }


  function calculateEntranceBill(data: MonthReport[]) {
    const monthNow = new Date().getMonth();
    const monthNowData = data.find(item => item.month === Months[monthNow]);

    if (monthNowData) {
      setMonthEntrance(monthNowData.Ingresos);
      setMonthBill(monthNowData.Gastos);
    }
  }



  async function handleAddMovement() {
    const value = addInputRef.current?.value;
    if (!value || !validNumberForMovement(value)) return;

    await toast.promise(
      addMovementForUser(TypeMovements.ENTRANCE, parseFloat(value), new Date()),
      {
        loading: "Agregando ingreso...",
        success: <b>Ingreso agregado!</b>,
        error: <b>No se pudo agregar el ingreso</b>
      }
    );

    addInputRef.current!.value = "";
    addModalRef.current?.close();
    modifyData();
  }

  async function handleSubtractMovement() {
    const value = subtractInputRef.current?.value;
    if (!value || !validNumberForMovement(value)) return;

    await toast.promise(
      addMovementForUser(TypeMovements.BILL, parseFloat(value), new Date()),
      {
        loading: "Agregando gasto...",
        success: <b>Gasto agregado!</b>,
        error: <b>No se pudo agregar el gasto</b>
      }
    );

    subtractInputRef.current!.value = "";
    substractModalRef.current?.close();
    modifyData();
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* --- TARJETAS --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500 mb-1">Balance Total</p>
                <h2 className="text-2xl font-semibold">₡{totalBalance}</h2>
              </div>
              <Wallet size={32} className="text-blue-600" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500 mb-1">Ingresos del Mes</p>
                <h2 className="text-2xl font-semibold text-green-600">+₡{monthEntrance}</h2>
              </div>
              <ArrowUpRight size={32} className="text-green-600" />
            </div>
          </div>

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

        {/* --- GRÁFICO --- */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <h5 className="text-lg font-semibold mb-4">Resumen Financiero</h5>
          <div className="h-[400px]">
            {isMounted && (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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

        {/* --- BOTONES --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          <button
            className="flex items-center justify-center gap-2 w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700"
            onClick={() => addModalRef.current?.showModal()}
          >
            <PlusCircle size={20} />
            Registrar Ingreso
          </button>

          <button
            className="flex items-center justify-center gap-2 w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700"
            onClick={() => substractModalRef.current?.showModal()}
          >
            <MinusCircle size={20} />
            Registrar Gasto
          </button>
        </div>

        {/* --- TABLA DE ÚLTIMOS MOVIMIENTOS --- */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h5 className="text-lg font-semibold mb-4">Últimos Movimientos</h5>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4">Fecha</th>
                  <th className="text-left py-3 px-4">Tipo</th>
                  <th className="text-right py-3 px-4">Cantidad</th>
                </tr>
              </thead>

              <tbody>
                {movements.length > 0 ? (
                  movements.map(movement => (
                    <tr key={movement.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="py-3 px-4">{formatDateString(movement.date)}</td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          {movement.TypeMovement.type === TypeMovements.ENTRANCE ? (
                            <>
                              <TrendingUp size={16} className="text-green-600" />
                              <span className="text-green-600 font-medium">Ingreso</span>
                            </>
                          ) : (
                            <>
                              <TrendingDown size={16} className="text-red-600" />
                              <span className="text-red-600 font-medium">Gasto</span>
                            </>
                          )}
                        </div>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <span
                          className={
                            movement.TypeMovement.type === TypeMovements.ENTRANCE
                              ? "text-green-600 font-semibold"
                              : "text-red-600 font-semibold"
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
                    <td className="py-8 px-4 text-center" colSpan={3}>
                      No hay movimientos registrados
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* MODALES */}
      <CustomModal
        title="Agregar ingreso"
        idModal="addModal"
        textPrimaryButton="Agregar"
        textSecondaryButton="Cancelar"
        ref={addModalRef}
        body={<InputLabel inputId="addInput" ref={addInputRef} inputPlaceHolder="0" textLabel="Ingreso" min={0} max={100000} typeInput="number" />}
        onClickPrimaryButton={handleAddMovement}
      />

      <CustomModal
        title="Agregar gasto"
        idModal="subtractionModal"
        textPrimaryButton="Agregar"
        textSecondaryButton="Cancelar"
        ref={substractModalRef}
        body={<InputLabel inputId="addInput" ref={subtractInputRef} inputPlaceHolder="0" textLabel="Gasto" min={0} max={100000} typeInput="number" />}
        onClickPrimaryButton={handleSubtractMovement}
      />

      <Toaster />
    </div>
  );
};

export default DashboardPage;

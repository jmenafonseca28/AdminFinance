export const TypeMovements = {
    ENTRANCE: "Ingreso",
    BILL: "Gasto"
};

export type TypeMovements = typeof TypeMovements[keyof typeof TypeMovements];
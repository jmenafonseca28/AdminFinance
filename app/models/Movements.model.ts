import TypeMovement from "./TypeMovement.model";

export default interface Movements {
    id: number;
    date: string;
    quantity: number;
    TypeMovement: TypeMovement;
}